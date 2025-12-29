import { Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { JiraIntegration, JiraStatus } from "./jira-integrations";

export default class JiraReporter implements Reporter {
  private jira = new JiraIntegration();
  private testResults = new Map<
    string,
    { test: TestCase; result: TestResult }
  >();

  printsToStdio() {
    return true;
  }

  onTestBegin(test: TestCase) {
    if (!this.jira.isEnabled()) return;

    const issueKey = this.jira.extractIssueKey(test.title);
    if (!issueKey) return;

    console.log(`🚀 Starting test: ${test.title} (Jira: ${issueKey})`);

    this.jira
      .updateStatus(test.title, JiraStatus.RUNNING, `Test execution started`)
      .catch((error) => {
        console.error(`Failed to update Jira at test start:`, error.message);
      });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    if (!this.jira.isEnabled()) return;

    const issueKey = this.jira.extractIssueKey(test.title);
    if (!issueKey) return;

    this.testResults.set(test.id, { test, result });
  }

  async onEnd() {
    if (!this.jira.isEnabled()) {
      console.log("📊 Jira reporter: integration disabled");
      return;
    }

    console.log(
      `📊 Jira reporter: Processing ${this.testResults.size} test results...`
    );

    for (const [testId, { test, result }] of this.testResults) {
      const issueKey = this.jira.extractIssueKey(test.title);
      if (!issueKey) continue;

      try {
        let finalStatus: JiraStatus;
        let comment: string;

        switch (result.status) {
          case "passed":
            finalStatus = JiraStatus.PASSED;
            comment = `✅ Test PASSED\nDuration: ${result.duration}ms\nRetries: ${result.retry}`;
            break;

          case "failed":
            finalStatus = JiraStatus.FAILED;
            const errorMessage =
              result.errors.length > 0
                ? result.errors[0].message?.substring(0, 300) || "Unknown error"
                : "Test failed";

            comment = `❌ Test FAILED\nDuration: ${result.duration}ms\nRetries: ${result.retry}\nError: ${errorMessage}`;
            break;

          case "timedOut":
            finalStatus = JiraStatus.FAILED;
            comment = `⏰ Test TIMED OUT\nTimeout: ${test.timeout}ms\nDuration: ${result.duration}ms`;
            break;

          case "skipped":
            finalStatus = JiraStatus.TODO;
            comment = `⏸️ Test SKIPPED`;
            break;

          default:
            finalStatus = JiraStatus.FAILED;
            comment = `❓ Test ended with status: ${result.status}\nDuration: ${result.duration}ms`;
        }

        await this.jira.updateStatus(test.title, finalStatus, comment);
        console.log(`✅ Updated ${issueKey} to ${finalStatus}`);
      } catch (error) {
        console.error(
          `❌ Failed to update ${issueKey}:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    console.log("📊 Jira reporter finished");
  }
}

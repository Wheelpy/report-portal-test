import axios, { AxiosInstance } from "axios";
import "dotenv/config";

export enum JiraStatus {
  RUNNING = "RUNNING",
  PASSED = "PASSED",
  FAILED = "FAILED",
  TODO = "TODO",
}

export class JiraIntegration {
  private client: AxiosInstance | null = null;

  constructor() {
    const jiraUrl = process.env.JIRA_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraToken = process.env.JIRA_API_TOKEN;

    if (jiraUrl && jiraEmail && jiraToken) {
      const baseURL = jiraUrl.endsWith("/") ? jiraUrl.slice(0, -1) : jiraUrl;

      this.client = axios.create({
        baseURL,
        auth: { username: jiraEmail, password: jiraToken },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("✅ Jira integration initialized");
      console.log(`🔗 URL: ${baseURL}`);
    } else {
      console.log(
        "⚠️ Jira integration disabled - set JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN in .env"
      );
    }
  }

  isEnabled(): boolean {
    return this.client !== null;
  }

  extractIssueKey(testName: string): string | null {
    // Ищем паттерн типа "KAN-4: Test" или "Test @KAN-5"
    const match = testName.match(/([A-Z]+-\d+)/);
    return match ? match[1] : null;
  }

  async updateStatus(
    testName: string,
    status: JiraStatus,
    comment?: string
  ): Promise<void> {
    if (!this.client) return;

    const issueKey = this.extractIssueKey(testName);
    if (!issueKey) {
      console.log(`📝 No Jira key in: "${testName}"`);
      return;
    }

    try {
      console.log(`🔄 Updating ${issueKey} to ${status}...`);

      // 1. Пробуем изменить статус
      await this.changeIssueStatus(issueKey, status);

      // 2. Добавляем комментарий
      await this.addComment(
        issueKey,
        comment ||
          `Test ${status}: ${testName}\nTime: ${new Date().toISOString()}`
      );

      console.log(`✅ Successfully updated ${issueKey} to ${status}`);
    } catch (error: any) {
      console.error(`❌ Failed to update ${issueKey}:`, error.message);
      if (error.response?.data) {
        console.error(
          "Error details:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }
  }

  private async addComment(issueKey: string, text: string): Promise<void> {
    if (!this.client) return;

    await this.client.post(`/rest/api/3/issue/${issueKey}/comment`, {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: text,
              },
            ],
          },
        ],
      },
    });
  }

  private async changeIssueStatus(
    issueKey: string,
    targetStatus: JiraStatus
  ): Promise<void> {
    if (!this.client) return;

    try {
      // 1. Получаем доступные переходы для этой задачи
      const response = await this.client.get(
        `/rest/api/3/issue/${issueKey}/transitions`,
        { params: { expand: "transitions.fields" } }
      );

      const transitions = response.data.transitions || [];
      console.log(
        `🔍 Available transitions for ${issueKey}:`,
        transitions.map((t: any) => `${t.name} (ID: ${t.id})`).join(", ")
      );

      // 2. Находим нужный переход
      const transition = this.findTransition(transitions, targetStatus);

      if (transition) {
        console.log(
          `🎯 Found transition: ${transition.name} (ID: ${transition.id})`
        );

        // 3. Выполняем переход
        await this.client.post(`/rest/api/3/issue/${issueKey}/transitions`, {
          transition: { id: transition.id },
        });

        console.log(`✓ Status changed to ${targetStatus}`);
      } else {
        console.log(`⚠️ No transition found for status: ${targetStatus}`);
        console.log(
          `   You might need to create transitions in your Jira workflow:`
        );
        console.log(`   "To Do" → "In Progress" (for RUNNING)`);
        console.log(`   "In Progress" → "Done" (for PASSED)`);
        console.log(`   "In Progress" → "To Do" (for FAILED)`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error(`❌ Issue ${issueKey} not found or no permission`);
      } else {
        console.error(
          `❌ Failed to change status for ${issueKey}:`,
          error.message
        );
      }
      throw error;
    }
  }

  private findTransition(
    transitions: any[],
    targetStatus: JiraStatus
  ): any | null {
    // Маппинг наших статусов на названия переходов в Jira
    const statusMapping: Record<JiraStatus, string[]> = {
      [JiraStatus.RUNNING]: [
        "In Progress",
        "Start Progress",
        "Begin",
        "Start",
        "RUNNING",
      ],
      [JiraStatus.PASSED]: [
        "Done",
        "Complete",
        "Close",
        "Resolve",
        "Pass",
        "PASSED",
      ],
      [JiraStatus.FAILED]: [
        "Reopen",
        "To Do",
        "Open",
        "Fail",
        "Failed",
        "FAILED",
      ],
      [JiraStatus.TODO]: ["To Do", "TODO", "Open", "Backlog"],
    };

    const targetNames = statusMapping[targetStatus] || [targetStatus];

    for (const transition of transitions) {
      const transitionName = transition.name.toLowerCase();

      for (const targetName of targetNames) {
        if (transitionName.includes(targetName.toLowerCase())) {
          return transition;
        }
      }
    }

    return null;
  }

  // Метод для получения текущего статуса задачи (для отладки)
  async getCurrentStatus(issueKey: string): Promise<string | null> {
    if (!this.client) return null;

    try {
      const response = await this.client.get(
        `/rest/api/3/issue/${issueKey}?fields=status`
      );
      return response.data.fields.status.name;
    } catch (error) {
      console.error(`Failed to get status for ${issueKey}:`, error);
      return null;
    }
  }

  // Метод для проверки подключения
  async testConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      const response = await this.client.get("/rest/api/3/myself");
      console.log(`✅ Connected to Jira as: ${response.data.displayName}`);
      return true;
    } catch (error: any) {
      console.error("❌ Jira connection failed:", error.message);
      return false;
    }
  }
}

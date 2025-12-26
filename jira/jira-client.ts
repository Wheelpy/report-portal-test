import axios, { AxiosInstance } from "axios";
import "dotenv/config";

export enum TestStatus {
  RUNNING = "RUNNING",
  PASSED = "PASSED",
  FAILED = "FAILED",
  TODO = "TODO",
}

export class JiraClient {
  private client: AxiosInstance;
  private isEnabled: boolean;

  constructor() {
    const jiraUrl = process.env.JIRA_URL;
    const jiraEmail = process.env.JIRA_EMAIL;
    const jiraToken = process.env.JIRA_API_TOKEN;

    // Проверяем наличие обязательных переменных
    this.isEnabled = !!(jiraUrl && jiraEmail && jiraToken);

    if (!this.isEnabled) {
      console.log(
        "⚠️ Jira integration disabled - missing environment variables"
      );
      return;
    }

    console.log("✅ Jira integration enabled");

    // Убираем trailing slash из URL
    const baseURL = jiraUrl!.endsWith("/") ? jiraUrl!.slice(0, -1) : jiraUrl!;

    this.client = axios.create({
      baseURL,
      auth: { username: jiraEmail!, password: jiraToken! },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  /**
   * Проверяет, включена ли интеграция
   */
  isJiraEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Извлекает Jira ключ из названия теста
   * Форматы: "PROJ-123: Test" или "Test @PROJ-123"
   */
  extractIssueKey(testName: string): string | null {
    const match = testName.match(/([A-Z]+-\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Основной метод обновления статуса теста
   */
  async updateTestStatus(
    testName: string,
    status: TestStatus,
    comment?: string
  ): Promise<void> {
    if (!this.isEnabled) return;

    const issueKey = this.extractIssueKey(testName);
    if (!issueKey) {
      console.log(`📝 No Jira key in: "${testName}"`);
      return;
    }

    try {
      console.log(`🔄 Updating ${issueKey} to ${status}...`);

      // 1. Добавляем комментарий
      await this.addComment(issueKey, comment || `Test ${status}: ${testName}`);

      // 2. Пробуем изменить статус
      await this.updateIssueStatus(issueKey, status);

      console.log(`✅ Updated ${issueKey} to ${status}`);
    } catch (error: any) {
      console.error(`❌ Failed to update ${issueKey}:`, error.message);
    }
  }

  /**
   * Добавляет комментарий к задаче
   */
  private async addComment(issueKey: string, text: string): Promise<void> {
    const comment = `
Test Result: ${text}
Time: ${new Date().toISOString()}
---
Automated by Playwright tests
    `.trim();

    await this.client.post(`/rest/api/3/issue/${issueKey}/comment`, {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: comment }],
          },
        ],
      },
    });
  }

  /**
   * Пытается изменить статус задачи
   */
  private async updateIssueStatus(
    issueKey: string,
    targetStatus: TestStatus
  ): Promise<void> {
    try {
      // Получаем доступные переходы
      const response = await this.client.get(
        `/rest/api/3/issue/${issueKey}/transitions`
      );

      const transitions = response.data.transitions || [];

      // Ищем подходящий переход
      const transition = this.findTransition(transitions, targetStatus);

      if (transition) {
        await this.client.post(`/rest/api/3/issue/${issueKey}/transitions`, {
          transition: { id: transition.id },
        });
      }
    } catch (error) {
      // Если не получилось изменить статус - не страшно, комментарий уже добавили
      console.log(
        `ℹ️ Could not change status for ${issueKey}, but comment was added`
      );
    }
  }

  /**
   * Находит переход по статусу
   */
  private findTransition(
    transitions: any[],
    targetStatus: TestStatus
  ): any | null {
    const statusMap: Record<TestStatus, string[]> = {
      [TestStatus.RUNNING]: ["In Progress", "Start Progress", "RUNNING"],
      [TestStatus.PASSED]: ["Done", "Pass", "Close", "PASSED"],
      [TestStatus.FAILED]: ["Fail", "Reopen", "To Do", "FAILED"],
      [TestStatus.TODO]: ["To Do", "TODO", "Open"],
    };

    const targetNames = statusMap[targetStatus] || [targetStatus];

    for (const transition of transitions) {
      const transitionName = transition.name.toUpperCase();

      for (const targetName of targetNames) {
        if (transitionName.includes(targetName.toUpperCase())) {
          return transition;
        }
      }
    }

    return null;
  }
}

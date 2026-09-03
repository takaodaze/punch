import type { Notifier } from "../../domain/notifier.ts";
import { formatDateTime } from "../../shared/format.ts";
import type { Session } from "../../domain/session.ts";

export class SlackNotifier implements Notifier {
  constructor(
    private readonly token: string,
    private readonly channel: string,
  ) {}

  notifyClockIn(session: Session): Promise<void> {
    return this.send(`🧑‍💻出勤: ${formatDateTime(session.clockIn)}`);
  }

  notifyClockOut(session: Session): Promise<void> {
    return this.send(`💤退勤: ${formatDateTime(session.clockOut!)}`);
  }

  private async send(text: string): Promise<void> {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ channel: this.channel, text }),
    });
    const body = await response.json();
    if (!response.ok || !body.ok) {
      console.error(`Failed to send Slack notification: ${body.error ?? response.statusText}`);
    }
  }
}

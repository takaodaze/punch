import type { Notifier } from "../../domain/notifier.ts";
import type { Session } from "../../domain/session.ts";

/** Used when Slack notifications are not configured. */
export class NoopNotifier implements Notifier {
  notifyClockIn(_session: Session): Promise<void> {
    return Promise.resolve();
  }
  notifyClockOut(_session: Session): Promise<void> {
    return Promise.resolve();
  }
}

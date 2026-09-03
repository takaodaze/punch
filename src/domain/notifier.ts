import type { Session } from "../domain/session.ts";

export interface Notifier {
  notifyClockIn(session: Session): Promise<void>;
  notifyClockOut(session: Session): Promise<void>;
}

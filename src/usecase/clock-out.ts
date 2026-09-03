import type { Notifier } from "../domain/notifier.ts";
import type { Session } from "../domain/session.ts";
import type { SessionRepository } from "../domain/session-repository.ts";
export type ClockOutResult = { ok: true; session: Session } | {
  ok: false;
  reason: "NOT_WORKING";
};
export class ClockOutUseCase {
  constructor(
    private readonly repository: SessionRepository,
    private readonly notifier: Notifier,
  ) {}
  async execute(now = new Date()): Promise<ClockOutResult> {
    const current = await this.repository.findCurrent();
    if (!current) return { ok: false, reason: "NOT_WORKING" };
    const session = current.finish(now);
    await this.repository.save(session);
    await this.notifier.notifyClockOut(session);
    return { ok: true, session };
  }
}

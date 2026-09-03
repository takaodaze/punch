import { Session } from "../domain/session.ts";
import type { SessionRepository } from "../domain/session-repository.ts";
export type ClockInResult = { ok: true; session: Session } | {
  ok: false;
  reason: "ALREADY_WORKING";
};
export class ClockInUseCase {
  constructor(private readonly repository: SessionRepository) {}
  async execute(now = new Date()): Promise<ClockInResult> {
    if (await this.repository.findCurrent()) {
      return { ok: false, reason: "ALREADY_WORKING" };
    }
    const session = Session.start(now);
    await this.repository.save(session);
    return { ok: true, session };
  }
}

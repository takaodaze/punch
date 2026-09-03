import type { Session } from "../domain/session.ts";
import type { SessionRepository } from "../domain/session-repository.ts";
export type AttendanceStatus = { state: "NOT_WORKING" } | {
  state: "WORKING";
  session: Session;
};
export class GetStatusUseCase {
  constructor(private readonly repository: SessionRepository) {}
  async execute(): Promise<AttendanceStatus> {
    const session = await this.repository.findCurrent();
    return session ? { state: "WORKING", session } : { state: "NOT_WORKING" };
  }
}

import type { Session } from "../domain/session.ts";
import type { SessionRepository } from "../domain/session-repository.ts";
export class GetHistoryUseCase {
  constructor(private readonly repository: SessionRepository) {}
  async execute(): Promise<Session[]> {
    return (await this.repository.findAll()).sort((a, b) =>
      b.clockIn.getTime() - a.clockIn.getTime()
    );
  }
}

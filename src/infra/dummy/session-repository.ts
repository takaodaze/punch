import type { Session } from "../../domain/session.ts";
import type { SessionRepository } from "../../domain/session-repository.ts";

export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions: Session[] = [];

  save(session: Session): Promise<void> {
    const index = this.sessions.findIndex(({ id }) => id === session.id);
    if (index === -1) this.sessions.push(session);
    else this.sessions[index] = session;
    return Promise.resolve();
  }
  findCurrent(): Promise<Session | null> {
    return Promise.resolve(
      this.sessions.find((session) => session.isWorking) ?? null,
    );
  }
  findAll(): Promise<Session[]> {
    return Promise.resolve([...this.sessions]);
  }
}

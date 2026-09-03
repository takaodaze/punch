import type { Session } from "./session.ts";

export interface SessionRepository {
  save(session: Session): Promise<void>;
  findCurrent(): Promise<Session | null>;
  findAll(): Promise<Session[]>;
}

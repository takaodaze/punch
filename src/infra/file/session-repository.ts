import { Session } from "../../domain/session.ts";
import type { SessionRepository } from "../../domain/session-repository.ts";

type SessionRecord = {
  id: string;
  clockIn: string;
  clockOut: string | null;
};

export class FileSessionRepository implements SessionRepository {
  constructor(private readonly filePath: string) {}

  async save(session: Session): Promise<void> {
    const sessions = await this.readAll();
    const index = sessions.findIndex(({ id }) => id === session.id);
    if (index === -1) sessions.push(session);
    else sessions[index] = session;
    await this.writeAll(sessions);
  }

  async findCurrent(): Promise<Session | null> {
    const sessions = await this.readAll();
    return sessions.find((session) => session.isWorking) ?? null;
  }

  findAll(): Promise<Session[]> {
    return this.readAll();
  }

  private async readAll(): Promise<Session[]> {
    let text: string;
    try {
      text = await Deno.readTextFile(this.filePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) return [];
      throw error;
    }
    if (text.trim() === "") return [];
    const records: SessionRecord[] = JSON.parse(text);
    return records.map(({ id, clockIn, clockOut }) =>
      new Session(id, new Date(clockIn), clockOut ? new Date(clockOut) : null)
    );
  }

  private async writeAll(sessions: Session[]): Promise<void> {
    const records: SessionRecord[] = sessions.map(({ id, clockIn, clockOut }) => ({
      id,
      clockIn: clockIn.toISOString(),
      clockOut: clockOut ? clockOut.toISOString() : null,
    }));
    await Deno.mkdir(dirname(this.filePath), { recursive: true });
    await Deno.writeTextFile(this.filePath, JSON.stringify(records, null, 2));
  }
}

function dirname(path: string): string {
  const index = path.lastIndexOf("/");
  return index === -1 ? "." : path.slice(0, index);
}

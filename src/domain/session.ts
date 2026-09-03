export class Session {
  constructor(
    readonly id: string,
    readonly clockIn: Date,
    readonly clockOut: Date | null,
  ) {}
  static start(now: Date, id = createSessionId()): Session {
    return new Session(id, now, null);
  }
  finish(now: Date): Session {
    if (this.clockOut !== null) {
      throw new Error(
        "Cannot finish an already completed attendance session.",
      );
    }
    return new Session(this.id, this.clockIn, now);
  }
  get isWorking(): boolean {
    return this.clockOut === null;
  }
}

function createSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

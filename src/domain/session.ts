export class Session {
  constructor(
    readonly id: string,
    readonly clockIn: Date,
    readonly clockOut: Date | null,
    /** The actual wall-clock time this record was created or last updated, as opposed to the (possibly backdated) clockIn/clockOut values. */
    readonly recordedAt: Date,
  ) {}
  static start(now: Date, id = createSessionId()): Session {
    return new Session(id, now, null, new Date());
  }
  finish(now: Date): Session {
    if (this.clockOut !== null) {
      throw new Error(
        "Cannot finish an already completed attendance session.",
      );
    }
    return new Session(this.id, this.clockIn, now, new Date());
  }
  get isWorking(): boolean {
    return this.clockOut === null;
  }
}

function createSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

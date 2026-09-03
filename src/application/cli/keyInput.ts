/** Reads one key at a time while stdin is in cbreak raw mode. */
export class RawKeyInput {
  private readonly buffer = new Uint8Array(1);
  enable(): void {
    if (!Deno.stdin.isTerminal()) {
      throw new Error("punch must be run in a terminal.");
    }
    Deno.stdin.setRaw(true, { cbreak: true });
  }
  disable(): void {
    if (Deno.stdin.isTerminal()) Deno.stdin.setRaw(false);
  }
  async readKey(): Promise<string | null> {
    const bytesRead = await Deno.stdin.read(this.buffer);
    return bytesRead === null
      ? null
      : new TextDecoder().decode(this.buffer.subarray(0, bytesRead));
  }
}

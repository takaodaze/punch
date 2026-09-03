/** Reads one key at a time while stdin is in raw mode. */
export class RawKeyInput {
  private readonly buffer = new Uint8Array(1);
  enable(): void {
    if (!Deno.stdin.isTerminal()) {
      throw new Error("punch must be run in a terminal.");
    }
    // cbreak keeps signal generation enabled, so Ctrl+C would raise SIGINT
    // and kill the process instead of being delivered as a byte. Full raw
    // mode disables that, letting Ctrl+C be read like any other key.
    Deno.stdin.setRaw(true);
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

import { ClockInUseCase } from "../../usecase/clock-in.ts";
import { ClockOutUseCase } from "../../usecase/clock-out.ts";
import { GetHistoryUseCase } from "../../usecase/get-history.ts";
import { GetStatusUseCase } from "../../usecase/get-status.ts";
import { RawKeyInput } from "./keyInput.ts";
import { Renderer } from "./renderer.ts";

export class CliApp {
  constructor(
    private readonly input: RawKeyInput,
    private readonly renderer: Renderer,
    private readonly clockIn: ClockInUseCase,
    private readonly clockOut: ClockOutUseCase,
    private readonly getStatus: GetStatusUseCase,
    private readonly getHistory: GetHistoryUseCase,
  ) {}

  async run(): Promise<void> {
    this.input.enable();
    try {
      this.renderer.menu();
      this.renderer.prompt();
      while (true) {
        const key = await this.input.readKey();
        this.renderer.echo(key ?? "");
        if (key === null || key === "q" || key === "\u0003") {
          this.renderer.goodbye();
          return;
        }
        await this.handle(key.toLowerCase());
        this.renderer.menu();
        this.renderer.prompt();
      }
    } finally {
      this.input.disable();
    }
  }

  private async handle(key: string): Promise<void> {
    const now = new Date();
    if (key === "i") {
      const result = await this.clockIn.execute(now);
      result.ok
        ? this.renderer.clockedIn(result.session)
        : this.renderer.alreadyClockedIn();
    } else if (key === "o") {
      const result = await this.clockOut.execute(now);
      result.ok
        ? this.renderer.clockedOut(result.session)
        : this.renderer.notWorking();
    } else if (key === "s") {
      this.renderer.status(await this.getStatus.execute(), now);
    } else if (key === "h") {
      this.renderer.history(await this.getHistory.execute(), now);
    }else{
      this.renderer.notSupportedMenu();
    }
  }
}

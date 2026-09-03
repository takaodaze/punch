import { CliApp } from "./application/cli/app.ts";
import { RawKeyInput } from "./application/cli/keyInput.ts";
import { Renderer } from "./application/cli/renderer.ts";
import { FileSessionRepository } from "./infra/file/session-repository.ts";
import { ClockInUseCase } from "./usecase/clock-in.ts";
import { ClockOutUseCase } from "./usecase/clock-out.ts";
import { GetHistoryUseCase } from "./usecase/get-history.ts";
import { GetStatusUseCase } from "./usecase/get-status.ts";

function defaultSessionsFilePath(): string {
  const dataHome = Deno.env.get("XDG_DATA_HOME") ??
    `${Deno.env.get("HOME")}/.local/share`;
  return `${dataHome}/punch/sessions.json`;
}

async function main(): Promise<void> {
  const repository = new FileSessionRepository(defaultSessionsFilePath());
  const app = new CliApp(
    new RawKeyInput(),
    new Renderer(),
    new ClockInUseCase(repository),
    new ClockOutUseCase(repository),
    new GetStatusUseCase(repository),
    new GetHistoryUseCase(repository),
  );
  await app.run();
}

await main();

import { CliApp } from "./application/cli/app.ts";
import { RawKeyInput } from "./application/cli/keyInput.ts";
import { Renderer } from "./application/cli/renderer.ts";
import { FileSessionRepository } from "./infra/file/session-repository.ts";
import { ClockInUseCase } from "./usecase/clock-in.ts";
import { ClockOutUseCase } from "./usecase/clock-out.ts";
import { GetHistoryUseCase } from "./usecase/get-history.ts";
import { GetStatusUseCase } from "./usecase/get-status.ts";

function sessionsFilePath(): string {
  const path = Deno.env.get("PUNCH_DB_PATH");
  if (!path) {
    console.error("PUNCH_DB_PATH is not set. Specify it in .env or the environment.");
    Deno.exit(1);
  }
  return path;
}

async function main(): Promise<void> {
  const repository = new FileSessionRepository(sessionsFilePath());
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

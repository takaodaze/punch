import { CliApp } from "./application/cli/app.ts";
import { RawKeyInput } from "./application/cli/keyInput.ts";
import { Renderer } from "./application/cli/renderer.ts";
import type { Notifier } from "./domain/notifier.ts";
import { NoopNotifier } from "./infra/dummy/notifier.ts";
import { FileSessionRepository } from "./infra/production/session-repository.ts";
import { SlackNotifier } from "./infra/production/notifier.ts";
import { ClockInUseCase } from "./usecase/clock-in.ts";
import { ClockOutUseCase } from "./usecase/clock-out.ts";
import { GetHistoryUseCase } from "./usecase/get-history.ts";
import { GetStatusUseCase } from "./usecase/get-status.ts";

function sessionsFilePath(): string {
  const path = Deno.env.get("PUNCH_DB_PATH");
  if (!path) {
    console.error(
      "PUNCH_DB_PATH is not set. Specify it in .env or the environment.",
    );
    Deno.exit(1);
  }
  return path;
}

function buildNotifier(): Notifier {
  const token = Deno.env.get("SLACK_BOT_TOKEN");
  const channel = Deno.env.get("SLACK_CHANNEL_ID");
  if (token && channel) {
    console.log("[Production] Using SlackNotifier");
    return new SlackNotifier(token, channel);
  }
  console.log("[Dummy] Using NoopNotifier");
  return new NoopNotifier();
}

async function main(): Promise<void> {
  const repository = new FileSessionRepository(sessionsFilePath());
  const notifier = buildNotifier();
  const app = new CliApp(
    new RawKeyInput(),
    new Renderer(),
    new ClockInUseCase(repository, notifier),
    new ClockOutUseCase(repository, notifier),
    new GetStatusUseCase(repository),
    new GetHistoryUseCase(repository),
  );
  await app.run();
}

await main();

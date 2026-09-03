import { InMemorySessionRepository } from "./infra/in-memory/session-repository.ts";
import { NoopNotifier } from "./infra/noop/notifier.ts";
import { ClockInUseCase } from "./usecase/clock-in.ts";
import { ClockOutUseCase } from "./usecase/clock-out.ts";
import { GetHistoryUseCase } from "./usecase/get-history.ts";
import { GetStatusUseCase } from "./usecase/get-status.ts";

const notifier = new NoopNotifier();

function assertEquals<T>(actual: T, expected: T): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

Deno.test("clock in creates one working session and prevents a duplicate", async () => {
  const repository = new InMemorySessionRepository();
  const clockIn = new ClockInUseCase(repository, notifier);
  const at = new Date("2026-09-03T09:32:14");
  const first = await clockIn.execute(at);
  const duplicate = await clockIn.execute(at);
  assertEquals(first.ok, true);
  assertEquals(duplicate, { ok: false, reason: "ALREADY_WORKING" });
  assertEquals((await repository.findCurrent())?.clockIn, at);
});

Deno.test("clock out completes the current session and status becomes not working", async () => {
  const repository = new InMemorySessionRepository();
  const clockIn = new ClockInUseCase(repository, notifier);
  const clockOut = new ClockOutUseCase(repository, notifier);
  const status = new GetStatusUseCase(repository);
  await clockIn.execute(new Date("2026-09-03T09:32:14"));
  const result = await clockOut.execute(new Date("2026-09-03T18:14:52"));
  assertEquals(result.ok, true);
  assertEquals((await status.execute()).state, "NOT_WORKING");
  assertEquals(
    (await repository.findAll())[0].clockOut,
    new Date("2026-09-03T18:14:52"),
  );
});

Deno.test("history returns newest sessions first", async () => {
  const repository = new InMemorySessionRepository();
  const clockIn = new ClockInUseCase(repository, notifier);
  const clockOut = new ClockOutUseCase(repository, notifier);
  await clockIn.execute(new Date("2026-09-02T09:00:00"));
  await clockOut.execute(new Date("2026-09-02T18:00:00"));
  await clockIn.execute(new Date("2026-09-03T09:00:00"));
  assertEquals(
    (await new GetHistoryUseCase(repository).execute()).map(({ clockIn }) =>
      clockIn.getDate()
    ),
    [3, 2],
  );
});

import type { Session } from "../../domain/session.ts";
import type { AttendanceStatus } from "../../usecase/get-status.ts";

const pad = (value: number) => String(value).padStart(2, "0");

const date = (value: Date): string =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;

const time = (value: Date): string =>
  `${pad(value.getHours())}:${pad(value.getMinutes())}:${
    pad(value.getSeconds())
  }`;

/** e.g. 9h 15m */
const fmtMsReadableTime = (ms: number) => {
  const minutes = Math.floor(ms / 60_000);
  return `${Math.floor(minutes / 60)}h ${pad(minutes % 60)}m`;
};

export class Renderer {
  menu(): void {
    console.log(
      "[i] Clock in   [o] Clock out   [h] History   [s] Status   [q] Quit",
    );
  }
  prompt(): void {
    Deno.stdout.writeSync(new TextEncoder().encode("> "));
  }
  echo(input: string): void {
    Deno.stdout.writeSync(new TextEncoder().encode(input));
  }
  notSupportedMenu(): void {
    console.log("\nNot supported menu\n");
  }
  cancelled(): void {
    console.log("\nCancelled.\n");
  }
  clockedIn(session: Session): void {
    console.log(`\nClocked in at ${time(session.clockIn)}\n`);
  }
  clockedOut(session: Session): void {
    console.log(`\nClocked out at ${time(session.clockOut!)}\n`);
  }
  alreadyClockedIn(): void {
    console.log("\nAlready clocked in.\n");
  }
  notWorking(): void {
    console.log("\nYou are not currently working.\n");
  }

  status(status: AttendanceStatus, now: Date): void {
    if (status.state === "NOT_WORKING") {
      console.log("\nSTATUS\n\n  ○ NOT WORKING\n");
      return;
    }
    console.log(
      `\nSTATUS\n\n  ● WORKING\n\n  Clock in: ${
        time(status.session.clockIn)
      }\n  Elapsed:  ${fmtMsReadableTime(status.session.durationTime(now))}\n`,
    );
  }

  history(sessions: Session[], now: Date): void {
    console.log("\nHISTORY\n\nDATE        CLOCK IN    CLOCK OUT    DURATION");
    let totalTime = 0;

    for (const session of sessions) {
      const out = session.clockOut;
      console.log(
        `${date(session.clockIn)}  ${time(session.clockIn)}    ${
          out ? time(out) : "--:--:--"
        }     ${fmtMsReadableTime(session.durationTime(now))}`,
      );

      totalTime += session.durationTime(now);
    }

    console.log(`\nTOTAL: ${fmtMsReadableTime(totalTime)}\n`);
  }

  goodbye(): void {
    console.log("\nGoodbye.");
  }
}

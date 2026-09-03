import type { RawKeyInput } from "./keyInput.ts";

/** Index within "YYYY-MM-DD HH:MM" of each editable digit, in order. */
const DIGIT_SLOTS = [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15] as const;

const ESC = "";
const CTRL_C = "";
const BACKSPACE = "";

function formatTemplate(date: Date): string {
  const pad = (value: number, length = 2) =>
    String(value).padStart(length, "0");
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${
    pad(date.getDate())
  } ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseTemplate(text: string): Date | null {
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  if (month < 1 || month > 12 || hour > 23 || minute > 59) return null;
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

const ENCODER = new TextEncoder();
const write = (text: string) => Deno.stdout.writeSync(ENCODER.encode(text));

/**
 * Interactive editor for a minute-precision date/time, prefilled with a
 * default value. Arrow keys move between digit slots, digits overwrite the
 * slot under the cursor, Enter confirms, and Ctrl+C cancels (returns null).
 */
export class DateTimeInput {
  constructor(private readonly input: RawKeyInput) {}

  async prompt(label: string, initial: Date): Promise<Date | null> {
    const chars = formatTemplate(initial).split("");
    let slot = 0;
    this.render(label, chars, slot);
    while (true) {
      const key = await this.input.readKey();
      if (key === null || key === CTRL_C) {
        write("\n");
        return null;
      }
      if (key === "\r" || key === "\n") {
        write("\n");
        return parseTemplate(chars.join(""));
      }
      if (key === ESC) {
        // Arrow keys arrive as the byte sequence ESC '[' <letter>.
        if (await this.input.readKey() === "[") {
          const arrow = await this.input.readKey();
          if (arrow === "C") {
            slot = Math.min(slot + 1, DIGIT_SLOTS.length - 1);
          } else if (arrow === "D") slot = Math.max(slot - 1, 0);
          this.render(label, chars, slot);
        }
        continue;
      }
      if (key === "l") {
        slot = Math.min(slot + 1, DIGIT_SLOTS.length - 1);
        this.render(label, chars, slot);
        continue;
      }
      if (key === "h") {
        slot = Math.max(slot - 1, 0);
        this.render(label, chars, slot);
        continue;
      }
      if (key === BACKSPACE || key === "\b") {
        slot = Math.max(slot - 1, 0);
        chars[DIGIT_SLOTS[slot]] = "0";
        this.render(label, chars, slot);
        continue;
      }
      if (/^[0-9]$/.test(key)) {
        chars[DIGIT_SLOTS[slot]] = key;
        slot = Math.min(slot + 1, DIGIT_SLOTS.length - 1);
        this.render(label, chars, slot);
      }
    }
  }

  private render(label: string, chars: string[], slot: number): void {
    const text = chars.join("");
    const index = DIGIT_SLOTS[slot];
    const highlighted = text.slice(0, index) + ESC + "[7m" + text[index] +
      ESC + "[0m" + text.slice(index + 1);
    write(`\r${ESC}[K${label}${highlighted}`);
  }
}

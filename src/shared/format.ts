import { toZonedDateTime } from "./timezone.ts";

const pad = (value: number, length = 2) => String(value).padStart(length, "0");

/** e.g. 2026-09-03 10:15 (JST, regardless of the runtime's local timezone) */
export const formatDateTime = (value: Date): string => {
  const zdt = toZonedDateTime(value);
  return `${zdt.year}-${pad(zdt.month)}-${pad(zdt.day)} ${pad(zdt.hour)}:${
    pad(zdt.minute)
  }`;
};

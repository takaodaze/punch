const pad = (value: number, length = 2) => String(value).padStart(length, "0");

/** e.g. 2026-09-03 10:15 */
export const formatDateTime = (value: Date): string =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${
    pad(value.getDate())
  } ${pad(value.getHours())}:${pad(value.getMinutes())}`;

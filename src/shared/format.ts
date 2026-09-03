const pad = (value: number, length = 2) => String(value).padStart(length, "0");

export const formatTime = (value: Date): string =>
  `${pad(value.getHours())}:${pad(value.getMinutes())}:${
    pad(value.getSeconds())
  }`;

export const formatDate = (value: Date): string =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;

export const formatDateTime = (value: Date): string =>
  `${formatDate(value)} ${pad(value.getHours())}:${pad(value.getMinutes())}`;

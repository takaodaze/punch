export const TIME_ZONE = "Asia/Tokyo";

/** Converts a Date to a JST ZonedDateTime, regardless of the runtime's local timezone. */
export const toZonedDateTime = (date: Date): Temporal.ZonedDateTime =>
  Temporal.Instant.fromEpochMilliseconds(date.getTime())
    .toZonedDateTimeISO(TIME_ZONE);

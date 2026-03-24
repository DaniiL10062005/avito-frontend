export const formatFieldValue = (value: unknown) =>
  typeof value === "number"
    ? String(value)
    : typeof value === "string"
      ? value
      : "";

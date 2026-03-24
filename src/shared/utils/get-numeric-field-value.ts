import { getDigitsOnlyValue } from "./get-digits-only-value";

export const getNumericFieldValue = (value: string) => {
  const digitsOnlyValue = getDigitsOnlyValue(value);

  return digitsOnlyValue === "" ? "" : Number(digitsOnlyValue);
};

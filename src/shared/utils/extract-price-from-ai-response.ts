import { getDigitsOnlyValue } from "./get-digits-only-value";

export const extractPriceFromAiResponse = (value: string) => {
  const match = value.match(/\d[\d\s]*/);

  if (!match) {
    return null;
  }

  const digitsOnlyValue = getDigitsOnlyValue(match[0]);

  return digitsOnlyValue === "" ? null : Number(digitsOnlyValue);
};

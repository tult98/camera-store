import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
  compact?: boolean
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
  compact = false,
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const convertedAmount = amount

  // Use Vietnamese locale for VND currency
  const displayLocale = currency_code.toUpperCase() === "VND" ? "vi-VN" : locale

  return new Intl.NumberFormat(displayLocale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits:
      minimumFractionDigits ??
      (currency_code.toUpperCase() === "VND" ? 0 : undefined),
    maximumFractionDigits:
      maximumFractionDigits ??
      (currency_code.toUpperCase() === "VND" ? 0 : undefined),
    ...(compact && { notation: "compact" as const }),
  }).format(convertedAmount)
}

export const formatPrice = (
  amount: number,
  currency: string,
  compact = false
) => {
  // Convert amount from cents to major currency unit
  const convertedAmount = amount

  // Use Vietnamese locale for VND currency
  const displayLocale = currency.toUpperCase() === "VND" ? "vi-VN" : "en-US"

  return new Intl.NumberFormat(displayLocale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits:
      currency.toUpperCase() === "VND" ? 0 : convertedAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: currency.toUpperCase() === "VND" ? 0 : 2,
    ...(compact && { notation: "compact" as const }),
  }).format(convertedAmount)
}

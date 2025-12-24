// src/lib/formatters.ts

/**
 * Format a date string into a readable format
 * @param dateString - ISO date string
 * @param locale - Locale to use (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = 'en-SG',
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(locale, options || defaultOptions);
};

/**
 * Format a date string into short numeric format (e.g., "12/24/2024")
 * @param dateString - ISO date string
 * @param locale - Locale to use (default: 'en-SG')
 * @returns Formatted date string
 */
export const formatDateShort = (
  dateString: string,
  locale: string = 'en-SG'
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a number as currency with proper symbol
 * @param amount - The amount to format
 * @param currency - Currency code (e.g., 'USD', 'SGD')
 * @param locale - Locale to use (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
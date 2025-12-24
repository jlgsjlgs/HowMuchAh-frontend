export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const generateCurrencyList = (): Currency[] => {
  const commonCurrencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
    'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'BRL', 'ZAR', 'MXN', 'IDR',
    'MYR', 'PHP', 'THB', 'VND', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR',
    'ILS', 'EGP', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'RUB', 'UAH', 'PKR',
    'BDT', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'TWD', 'CLP', 'ARS', 'COP',
    'PEN', 'VEF', 'UYU', 'PYG', 'BOB', 'DOP', 'GTQ', 'HNL', 'NIO', 'CRC',
  ];

  return commonCurrencies.map(code => {
    try {
      const symbol = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(0).replace(/\d/g, '').trim();

      const name = new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) || code;

      return { code, symbol, name };
    } catch {
      return { code, symbol: code, name: code };
    }
  }).sort((a, b) => a.code.localeCompare(b.code));
};

// Pre-generated list for better performance
export const CURRENCIES = generateCurrencyList();
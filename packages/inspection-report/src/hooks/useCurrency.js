import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const signAheadCurrencies = ['$', '£'];

/**
 * Currency context which will create wrapper for currency manipulation.
*/
export const Context = createContext({
  formateValue: (value) => { },
  updateCurrency: () => { },
});

/**
 * Currency wrapper used to abstract currency functionality.
 *
 * @return {React.ReactNode}
*/
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('€');

  /**
  * Format the value with currency symbol
  *
  * @param value Value to be formatted
  * @return {string} formatted value
 */
  const formateValue = useCallback((value) => {
    if (signAheadCurrencies.includes(currency)) {
      return `${currency}${value}`;
    }
    return `${value}${currency}`;
  }, [currency]);

  const currencyContextValue = useMemo(
    () => ({ updateCurrency: setCurrency, formateValue }),
    [currency],
  );

  return (
    <Context.Provider value={currencyContextValue}>
      {children}
    </Context.Provider>
  );
}

/**
 * Custom hook which will provide currency context which will expose all the functionality.
*/
export function useCurrency() {
  return useContext(Context);
}

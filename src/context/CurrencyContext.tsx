'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, LocationInfo } from '../types';
import { 
  detectUserLocation, 
  formatCurrency, 
  formatCurrencyCompact, 
  PRICING_BRACKETS, 
  RETAINER_PRICING, 
  CALCULATOR_DEFAULTS,
  CURRENCY_CONFIG 
} from '../utils/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  locationInfo: LocationInfo;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
  getPricingBracket: (service: 'website' | 'software' | 'webapp') => {
    range: string;
    startingAt: string;
    minAmount: number;
    maxAmount: number;
  };
  getRetainerRate: (plan: 'essentials' | 'growth' | 'scale', isAnnual: boolean) => number;
  calculatorConfig: {
    min: number;
    max: number;
    step: number;
    initial: number;
  };
  isAutoDetected: boolean;
  currencyConfig: typeof CURRENCY_CONFIG;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationInfo] = useState<LocationInfo>(() => detectUserLocation());
  
  // Initialize with stored currency or detected location currency (AED if UAE, otherwise INR)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem('bitnexel_currency') as CurrencyCode;
      if (saved && ['INR', 'AED', 'USD'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      // ignore
    }
    return locationInfo.currency;
  });

  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('bitnexel_currency');
    } catch (e) {
      return true;
    }
  });

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    setIsAutoDetected(false);
    try {
      localStorage.setItem('bitnexel_currency', newCurrency);
    } catch (e) {
      // ignore
    }
  };

  const formatAmount = (amount: number) => formatCurrency(amount, currency);
  const formatCompact = (amount: number) => formatCurrencyCompact(amount, currency);

  const getPricingBracket = (service: 'website' | 'software' | 'webapp') => {
    return PRICING_BRACKETS[service]?.[currency] || PRICING_BRACKETS[service]?.['INR'];
  };

  const getRetainerRate = (plan: 'essentials' | 'growth' | 'scale', isAnnual: boolean) => {
    const tier = RETAINER_PRICING[plan]?.[currency] || RETAINER_PRICING[plan]?.['INR'];
    return isAnnual ? tier.annual : tier.monthly;
  };

  const calculatorConfig = CALCULATOR_DEFAULTS[currency] || CALCULATOR_DEFAULTS.INR;

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        locationInfo,
        formatAmount,
        formatCompact,
        getPricingBracket,
        getRetainerRate,
        calculatorConfig,
        isAutoDetected,
        currencyConfig: CURRENCY_CONFIG
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

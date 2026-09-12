import { CurrencyCode, LocationInfo } from '../types';

export const CURRENCY_CONFIG: Record<CurrencyCode, {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  country: string;
  flag: string;
  usdRate: number; // For dynamic conversion if needed
}> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    country: 'India',
    flag: '🇮🇳',
    usdRate: 83.5
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    locale: 'en-AE',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    usdRate: 3.67
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    country: 'Global',
    flag: '🌐',
    usdRate: 1.0
  }
};

/**
 * Automatically detects whether the visitor is connecting from the UAE,
 * otherwise defaults to India (INR) as requested.
 */
export function detectUserLocation(): LocationInfo {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const languages = navigator.languages || [navigator.language || ''];
    const localeString = languages.join(',').toLowerCase();

    // Check for UAE timezone or locale
    const isUAE = 
      tz.includes('Dubai') || 
      tz.includes('Muscat') || 
      tz.includes('Asia/Dubai') || 
      localeString.includes('-ae') || 
      localeString.includes('ar-ae') ||
      localeString.includes('en-ae');

    if (isUAE) {
      return {
        country: 'United Arab Emirates',
        currency: 'AED',
        currencySymbol: 'AED ',
        currencyLabel: 'AED (د.إ)',
        isUAE: true
      };
    }

    // Default to INR
    return {
      country: 'India',
      currency: 'INR',
      currencySymbol: '₹',
      currencyLabel: 'INR (₹)',
      isUAE: false
    };
  } catch (err) {
    return {
      country: 'India',
      currency: 'INR',
      currencySymbol: '₹',
      currencyLabel: 'INR (₹)',
      isUAE: false
    };
  }
}

/**
 * Format a number according to the chosen currency.
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  if (currency === 'INR') {
    return '₹' + amount.toLocaleString('en-IN');
  } else if (currency === 'AED') {
    return 'AED ' + amount.toLocaleString('en-AE');
  } else {
    return '$' + amount.toLocaleString('en-US');
  }
}

/**
 * Short humanized format (e.g. ₹3.5L or AED 16.5K)
 */
export function formatCurrencyCompact(amount: number, currency: CurrencyCode): string {
  if (currency === 'INR') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')}L`;
    }
    return '₹' + amount.toLocaleString('en-IN');
  } else if (currency === 'AED') {
    if (amount >= 1000) {
      return `AED ${(amount / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return 'AED ' + amount.toLocaleString('en-AE');
  } else {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return '$' + amount.toLocaleString('en-US');
  }
}

/**
 * Static studio benchmark ranges for each service discipline
 */
export interface StudioPricingTier {
  range: string;
  startingAt: string;
  minAmount: number;
  maxAmount: number;
}

export const PRICING_BRACKETS: Record<string, Record<CurrencyCode, StudioPricingTier>> = {
  website: {
    INR: {
      range: '₹15,000 – ₹50,000',
      startingAt: '₹15,000',
      minAmount: 15000,
      maxAmount: 50000
    },
    AED: {
      range: 'AED 750 – AED 2,500',
      startingAt: 'AED 750',
      minAmount: 750,
      maxAmount: 2500
    },
    USD: {
      range: '$225 – $750',
      startingAt: '$225',
      minAmount: 225,
      maxAmount: 750
    }
  },
  software: {
    INR: {
      range: '₹1,00,000 – ₹2,50,000',
      startingAt: '₹1,00,000',
      minAmount: 100000,
      maxAmount: 250000
    },
    AED: {
      range: 'AED 5,000 – AED 12,500',
      startingAt: 'AED 5,000',
      minAmount: 5000,
      maxAmount: 12500
    },
    USD: {
      range: '$1,500 – $3,500',
      startingAt: '$1,500',
      minAmount: 1500,
      maxAmount: 3500
    }
  },
  webapp: {
    INR: {
      range: '₹2,00,000 – ₹5,00,000',
      startingAt: '₹2,00,000',
      minAmount: 200000,
      maxAmount: 500000
    },
    AED: {
      range: 'AED 10,000 – AED 25,000',
      startingAt: 'AED 10,000',
      minAmount: 10000,
      maxAmount: 25000
    },
    USD: {
      range: '$3,000 – $7,000',
      startingAt: '$3,000',
      minAmount: 3000,
      maxAmount: 7000
    }
  }
};

/**
 * Retainer monthly rates
 */
export const RETAINER_PRICING: Record<string, Record<CurrencyCode, { monthly: number; annual: number }>> = {
  essentials: {
    INR: { monthly: 5000, annual: 4000 },
    AED: { monthly: 250, annual: 200 },
    USD: { monthly: 70, annual: 55 }
  },
  growth: {
    INR: { monthly: 15000, annual: 12000 },
    AED: { monthly: 700, annual: 560 },
    USD: { monthly: 200, annual: 160 }
  },
  scale: {
    INR: { monthly: 30000, annual: 24000 },
    AED: { monthly: 1500, annual: 1200 },
    USD: { monthly: 400, annual: 320 }
  }
};

/**
 * Default budget steps for interactive sliders
 */
export const CALCULATOR_DEFAULTS: Record<CurrencyCode, { min: number; max: number; step: number; initial: number }> = {
  INR: {
    min: 15000,
    max: 500000,
    step: 10000,
    initial: 200000
  },
  AED: {
    min: 750,
    max: 25000,
    step: 500,
    initial: 10000
  },
  USD: {
    min: 225,
    max: 7000,
    step: 250,
    initial: 3000
  }
};

/**
 * Budget options for intake wizard by service and currency
 */
export const WIZARD_BUDGET_OPTIONS: Record<'website' | 'software' | 'webapp', Record<CurrencyCode, string[]>> = {
  website: {
    INR: [
      '₹15,000 – ₹25,000 (Core Flagship)',
      '₹25,000 – ₹40,000 (Expanded Multi-Page)',
      '₹40,000+ (Headless Enterprise)'
    ],
    AED: [
      'AED 750 – AED 1,250 (Core Flagship)',
      'AED 1,250 – AED 2,000 (Expanded Multi-Page)',
      'AED 2,000+ (Headless Enterprise)'
    ],
    USD: [
      '$225 – $375 (Core Flagship)',
      '$375 – $600 (Expanded Multi-Page)',
      '$600+ (Headless Enterprise)'
    ]
  },
  software: {
    INR: [
      '₹1,00,000 – ₹1,50,000 (Targeted Tool)',
      '₹1,50,000 – ₹2,00,000 (Core Operations Engine)',
      '₹2,00,000+ (Multi-System Suite)'
    ],
    AED: [
      'AED 5,000 – AED 7,500 (Targeted Tool)',
      'AED 7,500 – AED 10,000 (Core Operations Engine)',
      'AED 10,000+ (Multi-System Suite)'
    ],
    USD: [
      '$1,500 – $2,250 (Targeted Tool)',
      '$2,250 – $3,000 (Core Operations Engine)',
      '$3,000+ (Multi-System Suite)'
    ]
  },
  webapp: {
    INR: [
      '₹2,00,000 – ₹3,00,000 (Targeted Web App)',
      '₹3,00,000 – ₹4,00,000 (Multi-User Platform)',
      '₹4,00,000+ (Fintech / Enterprise SaaS)'
    ],
    AED: [
      'AED 10,000 – AED 15,000 (Targeted Web App)',
      'AED 15,000 – AED 20,000 (Multi-User Platform)',
      'AED 20,000+ (Fintech / Enterprise SaaS)'
    ],
    USD: [
      '$3,000 – $4,500 (Targeted Web App)',
      '$4,500 – $6,000 (Multi-User Platform)',
      '$6,000+ (Fintech / Enterprise SaaS)'
    ]
  }
};

/**
 * Budget options for quick contact form
 */
export const CONTACT_BUDGET_OPTIONS: Record<CurrencyCode, string[]> = {
  INR: [
    '₹15,000 – ₹50,000 (Flagship Website)',
    '₹1,00,000 – ₹2,50,000 (Custom Software / Portal)',
    '₹2,00,000 – ₹5,00,000+ (Full Web App / SaaS)',
    'Exploring / Scope Dependent'
  ],
  AED: [
    'AED 750 – AED 2,500 (Flagship Website)',
    'AED 5,000 – AED 12,500 (Custom Software / Portal)',
    'AED 10,000 – AED 25,000+ (Full Web App / SaaS)',
    'Exploring / Scope Dependent'
  ],
  USD: [
    '$225 – $750 (Flagship Website)',
    '$1,500 – $3,500 (Custom Software / Portal)',
    '$3,000 – $7,000+ (Full Web App / SaaS)',
    'Exploring / Scope Dependent'
  ]
};


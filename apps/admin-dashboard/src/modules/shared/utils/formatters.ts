export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPrice = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100); // Assuming amount is in cents
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    jpy: '¥',
    cny: '¥',
    php: '₱',
    inr: '₹',
    krw: '₩',
    aud: 'A$',
    cad: 'C$',
    chf: 'Fr',
    hkd: 'HK$',
    sgd: 'S$',
    nzd: 'NZ$',
    mxn: 'Mex$',
    brl: 'R$',
    rub: '₽',
    thb: '฿',
    try: '₺',
    zar: 'R',
  };

  return currencySymbols[currencyCode.toLowerCase()] || currencyCode.toUpperCase();
};

export const generateHandle = (title: string): string => {
  if (!title) return '';

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
export function formatMoney(amount: number, currency: 'USD' = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function formatAED(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' AED';
}

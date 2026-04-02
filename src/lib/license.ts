export interface LicenseResult {
  valid: boolean;
  planType?: '7days' | '1month' | 'lifetime';
  activationDate?: string;
  expirationDate?: string | null;
  error?: string;
}

export const validateLicense = async (key: string): Promise<LicenseResult> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const trimmed = key.trim().toUpperCase();
  const parts = trimmed.split('-');

  if (parts.length !== 4 || parts[0] !== 'VOID') {
    return { valid: false, error: 'Invalid license format' };
  }

  const [, planCode, , ] = parts;

  let planType: '7days' | '1month' | 'lifetime';
  if (planCode === 'XK9M') planType = '7days';
  else if (planCode === 'PJ2N') planType = '1month';
  else if (planCode === 'RV8T') planType = 'lifetime';
  else return { valid: false, error: 'Invalid plan code' };

  let expirationDate: string | null = null;

  if (planType === '7days') {
    const exp = new Date();
    exp.setDate(exp.getDate() + 7);
    expirationDate = exp.toISOString();
  } else if (planType === '1month') {
    const exp = new Date();
    exp.setMonth(exp.getMonth() + 1);
    expirationDate = exp.toISOString();
  }

  return {
    valid: true,
    planType,
    activationDate: new Date().toISOString(),
    expirationDate,
  };
};

export function isExpired(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  return new Date() > new Date(expirationDate);
}

export function getDaysRemaining(expirationDate: string | null): number | null {
  if (!expirationDate) return null;
  const diff = new Date(expirationDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getPlanLabel(planType: string): string {
  switch (planType) {
    case '7days': return '7-Day Pass';
    case '1month': return '1-Month Pass';
    case 'lifetime': return 'Lifetime';
    default: return planType;
  }
}

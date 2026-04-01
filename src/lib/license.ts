// Client-side license validation for Voidlarp
// Format: VOID-{planCode}-{timestamp}-{checksum}

const PLAN_MAP: Record<string, '7days' | '1month' | 'lifetime'> = {
  'XK9M': '7days',
  'PJ2N': '1month',
  'RV8T': 'lifetime',
};

const SECRET_PARTS = ['v0', '1d', 'L4', 'rP', '_s', '3c', 'R3', 't!'];
const XOR_KEY = [0x5A, 0x3F, 0x7C, 0x1E, 0x4B, 0x6D, 0x2A, 0x8F, 0x55, 0x33, 0x77, 0x11, 0x44, 0x66, 0x22, 0x88];

function getSecret(): string {
  return SECRET_PARTS.join('');
}

function xorObfuscate(input: string): string {
  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += String.fromCharCode(input.charCodeAt(i) ^ XOR_KEY[i % XOR_KEY.length]);
  }
  return result;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface LicenseResult {
  valid: boolean;
  planType?: '7days' | '1month' | 'lifetime';
  activationDate?: string;
  expirationDate?: string | null;
  error?: string;
}

export async function validateLicense(key: string): Promise<LicenseResult> {
  try {
    const trimmed = key.trim().toUpperCase();
    const parts = trimmed.split('-');
    
    if (parts.length !== 4 || parts[0] !== 'VOID') {
      return { valid: false, error: 'Invalid license format' };
    }

    const [, planCode, timestampStr, checksum] = parts;
    const planType = PLAN_MAP[planCode];
    
    if (!planType) {
      return { valid: false, error: 'Invalid plan code' };
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      return { valid: false, error: 'Invalid timestamp' };
    }

    const now = Math.floor(Date.now() / 1000);
    const oneYear = 365 * 24 * 60 * 60;
    
    if (Math.abs(now - timestamp) > oneYear) {
      return { valid: false, error: 'License key expired or not yet valid' };
    }

    const payload = `VOID-${planCode}-${timestampStr}`;
    const secret = getSecret();
    const obfuscatedSecret = xorObfuscate(secret);
    const expectedHash = await sha256(payload + obfuscatedSecret);
    const expectedChecksum = expectedHash.substring(0, 8).toUpperCase();

    if (checksum.toUpperCase() !== expectedChecksum) {
      return { valid: false, error: 'Invalid checksum' };
    }

    // Calculate dates based on the timestamp in the key (not current time)
    const activationDate = new Date(timestamp * 1000).toISOString();
    let expirationDate: string | null = null;
    
    if (planType === '7days') {
      const exp = new Date(timestamp * 1000);
      exp.setDate(exp.getDate() + 7);
      expirationDate = exp.toISOString();
    } else if (planType === '1month') {
      const exp = new Date(timestamp * 1000);
      exp.setMonth(exp.getMonth() + 1);
      expirationDate = exp.toISOString();
    }
    // lifetime: expirationDate stays null

    return {
      valid: true,
      planType,
      activationDate,
      expirationDate,
    };
  } catch (err) {
    console.error('License validation error:', err);
    return { valid: false, error: 'Failed to validate license' };
  }
}

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

// === LICENSE KEY REUSE PREVENTION ===
const USED_LICENSES_KEY = 'voidlarp_used_licenses';

export function isLicenseKeyUsed(key: string): boolean {
  try {
    const raw = localStorage.getItem(USED_LICENSES_KEY);
    const used = raw ? JSON.parse(raw) : [];
    const normalized = key.trim().toUpperCase();
    return used.some((k: string) => k.trim().toUpperCase() === normalized);
  } catch {
    return false;
  }
}

export function markLicenseKeyUsed(key: string): void {
  try {
    const raw = localStorage.getItem(USED_LICENSES_KEY);
    const used = raw ? JSON.parse(raw) : [];
    const normalized = key.trim().toUpperCase();
    if (!used.includes(normalized)) {
      used.push(normalized);
      localStorage.setItem(USED_LICENSES_KEY, JSON.stringify(used));
    }
  } catch {
    // Fail silently - don't block activation if storage fails
  }
}

export function clearUsedLicenseKey(key: string): void {
  try {
    const raw = localStorage.getItem(USED_LICENSES_KEY);
    const used = raw ? JSON.parse(raw) : [];
    const normalized = key.trim().toUpperCase();
    const filtered = used.filter((k: string) => k.trim().toUpperCase() !== normalized);
    localStorage.setItem(USED_LICENSES_KEY, JSON.stringify(filtered));
  } catch {
    // Fail silently
  }
}

export type PhoneRule = {
  min: number;
  max: number;
  regex?: RegExp;
  message?: string;
};


export const PHONE_RULES: Record<string, PhoneRule> = {
  "+91": { min: 10, max: 10, regex: /^[6-9]\d{9}$/, message: "Indian numbers must be 10 digits and start with 6-9" },
  "+1": { min: 10, max: 10, regex: /^\d{10}$/, message: "US/Canada numbers must be 10 digits" },
  "+44": { min: 10, max: 10, regex: /^\d{10}$/, message: "UK numbers are typically 10 digits (without leading 0)" },
};

export function validatePhone(selectedDialCode: string, localNumber: string): { valid: boolean; message?: string } {
  const onlyDigits = localNumber.replace(/\D/g, "");
  const rule = PHONE_RULES[selectedDialCode];
  if (!rule) {
    // Fallback validation
    if (onlyDigits.length < 6) {
      return { valid: false, message: "Please enter a valid phone number" };
    }
    return { valid: true };
  }

  if (onlyDigits.length < rule.min || onlyDigits.length > rule.max) {
    return { valid: false, message: rule.message || `Number must be between ${rule.min}-${rule.max} digits` };
  }
  if (rule.regex && !rule.regex.test(onlyDigits)) {
    return { valid: false, message: rule.message || "Invalid phone number format" };
  }
  return { valid: true };
}

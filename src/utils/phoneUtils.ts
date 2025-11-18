/**
 * Phone number utility functions for formatting, validation, and conversion
 */

/**
 * Formats a phone number input to display format: (555) 123-4567
 * Handles partial input and auto-formats as user types
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  let numbers = value.replace(/\D/g, '');

  // Remove leading '1' if number is 11 digits (US country code)
  if (numbers.length === 11 && numbers.startsWith('1')) {
    numbers = numbers.slice(1);
  }
  
  // Limit to 10 digits
  const limitedNumbers = numbers.slice(0, 10);
  
  // Format based on length
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3)}`;
  } else {
    return `(${limitedNumbers.slice(0, 3)}) ${limitedNumbers.slice(3, 6)}-${limitedNumbers.slice(6)}`;
  }
};

/**
 * Validates if a phone number matches the display format: (555) 123-4567
 */
export const validatePhoneFormat = (phone: string): boolean => {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
};

/**
 * Converts a formatted phone number to E.164 format: +15551234567
 * Used for sending to backend APIs that expect E.164 format
 */
export const convertPhoneToE164 = (formattedPhone: string): string | null => {
  if (!formattedPhone || !formattedPhone.trim()) {
    return null;
  }
  
  // Trim whitespace
  const trimmed = formattedPhone.trim();
  
  // If already in E.164 format, return as-is
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  
  // Remove all non-numeric characters
  const numbers = trimmed.replace(/\D/g, '');
  
  // Remove leading 1 if present (US country code)
  const cleanNumbers = numbers.length === 11 && numbers.startsWith('1') 
    ? numbers.slice(1) 
    : numbers;
  
  // If we have 10 digits, return in E.164 format with US country code
  if (cleanNumbers.length === 10) {
    return `+1${cleanNumbers}`;
  }
  
  // If we have less than 10 digits, it's invalid - return null
  if (cleanNumbers.length < 10) {
    return null;
  }
  
  // If we have more than 10 digits, take the last 10
  if (cleanNumbers.length > 10) {
    return `+1${cleanNumbers.slice(-10)}`;
  }
  
  return null;
};

/**
 * Comprehensive phone number validation
 * Returns validation result with error message if invalid
 */
export const validatePhoneNumber = (
  phone: string,
  convertToE164: (phone: string) => string | null = convertPhoneToE164
): { isValid: boolean; error?: string } => {
  // Phone is optional - if empty, it's valid
  if (!phone || !phone.trim()) {
    return { isValid: true };
  }
  
  // Check format first
  if (!validatePhoneFormat(phone)) {
    return { isValid: false, error: "Please enter a valid phone number in the format: (555) 123-4567" };
  }
  
  // Extract digits
  const digits = phone.replace(/\D/g, '');
  
  // Check for obviously invalid patterns
  // All same digit (e.g., 111-111-1111)
  if (/^(\d)\1{9}$/.test(digits)) {
    return { isValid: false, error: "Please enter a valid phone number. Numbers with all the same digits are not valid." };
  }
  
  // Check if area code is valid (not 000, 111, etc.)
  const areaCode = digits.substring(0, 3);
  if (/^(\d)\1{2}$/.test(areaCode)) {
    return { isValid: false, error: "Please enter a valid phone number. The area code cannot be all the same digit." };
  }
  
  // Check if exchange code is valid (not 000, 111, etc.)
  const exchangeCode = digits.substring(3, 6);
  if (/^(\d)\1{2}$/.test(exchangeCode)) {
    return { isValid: false, error: "Please enter a valid phone number. The exchange code cannot be all the same digit." };
  }
  
  // Try to convert to E.164 to ensure it's valid
  const e164Format = convertToE164(phone);
  if (!e164Format) {
    return { isValid: false, error: "Please enter a valid phone number." };
  }
  
  return { isValid: true };
};

/**
 * Simple phone validation (format only)
 * For basic validation without detailed error messages
 */
export const validatePhone = (phone: string): boolean => {
  return validatePhoneFormat(phone);
};


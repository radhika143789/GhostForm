
interface PasswordValidationResult {
  valid: boolean;
  message: string;
  score: number; // 0-4, 0 being weakest, 4 being strongest
}

export function validatePassword(password: string): PasswordValidationResult {
  // Initialize result
  const result: PasswordValidationResult = {
    valid: true,
    message: '',
    score: 0
  };

  // Check minimum length
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
      score: 0
    };
  }

  // Check complexity requirements
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate score based on complexity
  let score = 0;
  if (password.length >= 8) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumbers) score += 1;
  if (hasSpecialChars) score += 1;

  // Generate validation message based on missing requirements
  const missingRequirements: string[] = [];
  
  if (!hasUppercase) missingRequirements.push('an uppercase letter');
  if (!hasLowercase) missingRequirements.push('a lowercase letter');
  if (!hasNumbers) missingRequirements.push('a number');
  if (!hasSpecialChars) missingRequirements.push('a special character');

  // Pass validation if we have at least 3 out of 4 complexity requirements
  const minRequirementsMet = 
    (hasUppercase ? 1 : 0) + 
    (hasLowercase ? 1 : 0) + 
    (hasNumbers ? 1 : 0) + 
    (hasSpecialChars ? 1 : 0) >= 3;

  if (!minRequirementsMet) {
    return {
      valid: false,
      message: `Password must include ${missingRequirements.join(', ')}`,
      score: score
    };
  }

  return {
    valid: true,
    message: 'Password meets requirements',
    score: score
  };
}

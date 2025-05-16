
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateStrength = (password: string): number => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 10) score += 10;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 20; // Has uppercase
    if (/[a-z]/.test(password)) score += 15; // Has lowercase
    if (/[0-9]/.test(password)) score += 15; // Has number
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20; // Has special char
    
    return Math.min(score, 100);
  };

  const getColorForStrength = (strength: number): string => {
    if (strength < 30) return 'bg-destructive';
    if (strength < 50) return 'bg-amber-500';
    if (strength < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextForStrength = (strength: number): string => {
    if (strength < 30) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const strength = calculateStrength(password);
  const color = getColorForStrength(strength);
  const text = getTextForStrength(strength);

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs">
        <span>Password strength:</span>
        <span className={strength >= 80 ? 'text-green-500' : strength >= 50 ? 'text-yellow-500' : strength >= 30 ? 'text-amber-500' : 'text-destructive'}>
          {text}
        </span>
      </div>
      <Progress value={strength} className={`h-2 ${color}`} />
    </div>
  );
};

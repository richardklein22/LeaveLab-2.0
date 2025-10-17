'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'One number',
    test: (password) => /\d/.test(password),
  },
  {
    label: 'One special character (@$!%*?&#)',
    test: (password) => /[@$!%*?&#]/.test(password),
  },
];

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export function PasswordRequirements({
  password,
  className,
}: PasswordRequirementsProps) {
  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-sm font-medium text-muted-foreground">
        Password requirements:
      </p>
      <ul className="space-y-1.5">
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <li
              key={index}
              className="flex items-center gap-2 text-sm"
            >
              {isMet ? (
                <Check className="h-4 w-4 text-green-600" aria-label="met" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" aria-label="not met" />
              )}
              <span
                className={cn(
                  'transition-colors',
                  isMet ? 'text-green-600 font-medium' : 'text-muted-foreground'
                )}
              >
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

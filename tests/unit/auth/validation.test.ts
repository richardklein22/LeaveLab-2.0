import { describe, expect, it } from '@jest/globals';
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  profileUpdateSchema,
} from '@/features/auth/lib/validation';

describe('Auth Validation Schemas', () => {
  describe('T030: Email Validation', () => {
    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
        '',
      ];

      invalidEmails.forEach((email) => {
        const result = signupSchema.safeParse({
          email,
          password: 'ValidPass123!',
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain('email');
        }
      });
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@subdomain.example.com',
        'user123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        const result = signupSchema.safeParse({
          email,
          password: 'ValidPass123!',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should provide British English error messages for invalid emails', () => {
      const result = signupSchema.safeParse({
        email: 'invalid-email',
        password: 'ValidPass123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((issue) =>
          issue.path.includes('email')
        );
        expect(emailError?.message).toMatch(/email/i);
      }
    });

    it('should reject empty email', () => {
      const result = signupSchema.safeParse({
        email: '',
        password: 'ValidPass123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });
  });

  describe('T031: Password Strength Validation', () => {
    it('should reject passwords shorter than 8 characters', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'Short1!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes('password')
        );
        expect(passwordError?.message).toMatch(/8 characters/i);
      }
    });

    it('should reject passwords without uppercase letters', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'lowercase123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes('password')
        );
        expect(passwordError?.message).toMatch(/uppercase/i);
      }
    });

    it('should reject passwords without lowercase letters', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'UPPERCASE123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes('password')
        );
        expect(passwordError?.message).toMatch(/lowercase/i);
      }
    });

    it('should reject passwords without numbers', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'NoNumbers!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes('password')
        );
        expect(passwordError?.message).toMatch(/number/i);
      }
    });

    it('should reject passwords without special characters', () => {
      const result = signupSchema.safeParse({
        email: 'user@example.com',
        password: 'NoSpecial123',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) =>
          issue.path.includes('password')
        );
        expect(passwordError?.message).toMatch(/special character/i);
      }
    });

    it('should accept passwords meeting all requirements', () => {
      const validPasswords = [
        'ValidPass123!',
        'MyP@ssw0rd',
        'Secure#Pass99',
        'Test$1234Abc',
      ];

      validPasswords.forEach((password) => {
        const result = signupSchema.safeParse({
          email: 'user@example.com',
          password,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should provide specific error messages for weak passwords in British English', () => {
      const weakPasswords = [
        { password: 'short', expectedError: /8 characters/i },
        { password: 'nouppercase123!', expectedError: /uppercase/i },
        { password: 'NOLOWERCASE123!', expectedError: /lowercase/i },
        { password: 'NoNumbers!', expectedError: /number/i },
        { password: 'NoSpecial123', expectedError: /special character/i },
      ];

      weakPasswords.forEach(({ password, expectedError }) => {
        const result = signupSchema.safeParse({
          email: 'user@example.com',
          password,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          const passwordError = result.error.issues.find((issue) =>
            issue.path.includes('password')
          );
          expect(passwordError?.message).toMatch(expectedError);
        }
      });
    });
  });

  describe('Login Validation', () => {
    it('should validate email and password for login', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'anypassword',
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty credentials', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Reset Password Validation', () => {
    it('should validate email for password reset', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'user@example.com',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'invalid',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Update Password Validation', () => {
    it('should validate new password meets requirements', () => {
      const result = updatePasswordSchema.safeParse({
        password: 'NewValidPass123!',
        confirmPassword: 'NewValidPass123!',
      });

      expect(result.success).toBe(true);
    });

    it('should reject weak new password', () => {
      const result = updatePasswordSchema.safeParse({
        password: 'weak',
        confirmPassword: 'weak',
      });

      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = updatePasswordSchema.safeParse({
        password: 'ValidPass123!',
        confirmPassword: 'DifferentPass123!',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/match/i);
      }
    });
  });

  describe('Profile Update Validation', () => {
    it('should validate display name (optional)', () => {
      const result = profileUpdateSchema.safeParse({
        displayName: 'John Doe',
      });

      expect(result.success).toBe(true);
    });

    it('should accept empty optional fields', () => {
      const result = profileUpdateSchema.safeParse({});

      expect(result.success).toBe(true);
    });

    it('should reject display name longer than 100 characters', () => {
      const result = profileUpdateSchema.safeParse({
        displayName: 'A'.repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });
});

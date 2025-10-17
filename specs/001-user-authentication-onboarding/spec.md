# Feature Specification: User Authentication & Onboarding

**Feature Branch**: `001-user-authentication-onboarding`  
**Created**: 2025-10-08  
**Status**: Draft  
**Input**: User description: "We need a complete authentication system that allows users to create accounts, log in, manage their profiles, and reset passwords. This will use Supabase Auth with email/password and Google Auth options. All user data must be protected with Row-Level Security policies. The experience must be mobile-first with clear error messaging and loading states."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email/Password Account Creation (Priority: P1)

A prospective digital nomad visits LeaveLab and wants to create an account to access courses and resources. They provide their email address and create a password, then verify their email to activate their account.

**Why this priority**: This is the most critical user journey. Without account creation, no users can access the platform. Email/password authentication is the baseline authentication method that works for all users regardless of their social login preferences.

**Independent Test**: Can be fully tested by visiting the signup page, entering valid credentials, receiving a verification email, and confirming the account is created and accessible after verification.

**Acceptance Scenarios**:

1. **Given** a new visitor on the signup page, **When** they enter a valid email address and strong password and submit the form, **Then** they receive a verification email and see a message instructing them to check their inbox
2. **Given** a user with a pending verification email, **When** they click the verification link in their email, **Then** their account is activated and they are redirected to their dashboard with a welcome message
3. **Given** a user on the signup page, **When** they enter an email that already exists in the system, **Then** they see an error message stating "An account with this email already exists" and are offered a link to log in or reset their password
4. **Given** a user on the signup page, **When** they enter a weak password (less than 8 characters or missing required complexity), **Then** they see real-time validation feedback indicating password requirements
5. **Given** a user on the signup page, **When** they enter an invalid email format, **Then** they see an error message "Please enter a valid email address"

---

### User Story 2 - Google OAuth Account Creation & Login (Priority: P2)

A prospective digital nomad wants to quickly create an account or log in using their existing Google account, avoiding the need to remember another password.

**Why this priority**: OAuth provides a frictionless onboarding experience and reduces password fatigue. This is critical for conversion rates, especially on mobile devices where typing is cumbersome. Second priority because email/password must exist as a fallback.

**Independent Test**: Can be fully tested by clicking "Continue with Google" button, authenticating via Google's OAuth flow, and verifying the user is logged in or a new account is created.

**Acceptance Scenarios**:

1. **Given** a new visitor on the signup page, **When** they click "Continue with Google" and authorise LeaveLab in the Google consent screen, **Then** a new account is created with their Google profile information and they are logged in to their dashboard
2. **Given** an existing user who previously created an account with Google, **When** they click "Continue with Google" on the login page and authorise, **Then** they are logged in to their existing account
3. **Given** a user who clicks "Continue with Google", **When** they cancel the Google authorisation dialog, **Then** they are returned to the login/signup page with a message "Google sign-in was cancelled"
4. **Given** a user who created an account with email/password using email "user@gmail.com", **When** they attempt to sign in with Google using the same email "user@gmail.com", **Then** the system automatically links the Google OAuth provider to their existing account and they are logged in successfully with a notification "Google account linked successfully"

---

### User Story 3 - Password Reset (Priority: P1)

A user who previously created an account with email/password has forgotten their password and needs to regain access to their account.

**Why this priority**: Password recovery is essential for user retention. Without it, users who forget passwords are permanently locked out, leading to support burden and lost revenue. This is P1 because it's a critical path for existing users.

**Independent Test**: Can be fully tested by clicking "Forgot password?", entering an email address, receiving a password reset email, setting a new password, and logging in with the new credentials.

**Acceptance Scenarios**:

1. **Given** a user on the login page who doesn't remember their password, **When** they click "Forgot password?" and enter their email address, **Then** they receive an email with a password reset link and see a message "Check your email for reset instructions"
2. **Given** a user who received a password reset email, **When** they click the reset link and enter a new valid password, **Then** their password is updated and they are logged in to their dashboard with a success message "Password successfully reset"
3. **Given** a user on the password reset page, **When** they enter an email address that doesn't exist in the system, **Then** they see a message "If an account exists with this email, you will receive reset instructions" (security best practice to prevent email enumeration)
4. **Given** a user with a password reset link, **When** the link is older than 1 hour, **Then** they see an error message "This reset link has expired. Please request a new one"
5. **Given** a user who has requested multiple password resets, **When** they use an old reset link after a newer one was sent, **Then** they see an error "This reset link is no longer valid. A newer reset link was sent"

---

### User Story 4 - Login with Email/Password (Priority: P1)

A returning user wants to access their account by providing their email address and password.

**Why this priority**: Login is as critical as signup. Without reliable login, users cannot access the platform. This is P1 because it's the most common daily interaction.

**Independent Test**: Can be fully tested by navigating to the login page, entering valid credentials, and verifying successful access to the user's dashboard.

**Acceptance Scenarios**:

1. **Given** a user with an activated account on the login page, **When** they enter their correct email and password and submit, **Then** they are logged in and redirected to their dashboard
2. **Given** a user on the login page, **When** they enter an incorrect password, **Then** they see an error message "Invalid email or password" and remain on the login page
3. **Given** a user who has entered an incorrect password 5 times in 10 minutes, **When** they attempt to log in again, **Then** the system sends a security alert email to the registered email address with details of the failed login attempts and a link to reset password if needed
4. **Given** a logged-in user who closes the browser, **When** they return to LeaveLab within 7 days, **Then** they remain logged in and can access their account without re-authenticating
5. **Given** a user on the login page, **When** they click "Remember me" and successfully log in, **Then** their session persists even after closing the browser

---

### User Story 5 - Profile Management (Priority: P2)

A logged-in user wants to view and update their personal information including name, profile picture, email address, and account preferences.

**Why this priority**: Profile management is important for personalisation and user control, but it's secondary to authentication flows. Users can access the platform with basic profile data from signup. This is P2 because it can be added after core auth flows are working.

**Independent Test**: Can be fully tested by logging in, navigating to profile settings, updating various fields, saving changes, and verifying the updates persist.

**Acceptance Scenarios**:

1. **Given** a logged-in user on their profile settings page, **When** they update their display name and click "Save changes", **Then** they see a success message "Profile updated successfully" and their new name appears throughout the application
2. **Given** a logged-in user on their profile settings page, **When** they upload a new profile picture (JPG, PNG, or WebP format, max 5MB), **Then** the image is uploaded and displayed as their profile picture
3. **Given** a logged-in user on their profile settings page, **When** they attempt to change their email address to a new valid email, **Then** they receive a verification email at the new address and must confirm before the change takes effect
4. **Given** a logged-in user on their profile settings page, **When** they update their profile information but navigate away without clicking "Save changes", **Then** they see a warning "You have unsaved changes. Are you sure you want to leave?"
5. **Given** a logged-in user viewing their profile, **When** they see their profile information, **Then** sensitive data (like full email address) is partially masked or only shown when explicitly requested

---

### User Story 6 - Account Settings & Password Change (Priority: P3)

A logged-in user wants to manage their account security settings, including changing their password, viewing active sessions, and managing connected OAuth providers.

**Why this priority**: Account security settings are important for user trust and GDPR compliance, but they're not required for initial platform access. This is P3 because it enhances security but doesn't block basic functionality.

**Independent Test**: Can be fully tested by logging in, navigating to account settings, changing password, and verifying the new password works for future logins.

**Acceptance Scenarios**:

1. **Given** a logged-in user on their account settings page, **When** they enter their current password and a new valid password and click "Change password", **Then** their password is updated and they see a confirmation message "Password changed successfully"
2. **Given** a logged-in user changing their password, **When** they enter an incorrect current password, **Then** they see an error "Current password is incorrect"
3. **Given** a logged-in user on their account settings page, **When** they view the "Connected accounts" section, **Then** they see which OAuth providers (Google) are linked to their account
4. **Given** a logged-in user who signed up with Google OAuth, **When** they want to add email/password authentication to their account, **Then** they can set a password to enable email/password login as a backup method
5. **Given** a logged-in user on their account settings page, **When** they click "Log out of all devices", **Then** all active sessions are terminated and they must log in again on all devices

---

### Edge Cases

- What happens when a user tries to verify their email with an expired verification link (older than 24 hours)?
- What happens when a user tries to upload a profile picture larger than 5MB or in an unsupported format?
- What happens when a user with Google OAuth tries to reset their password (they don't have one)?
- What happens when a user changes their email address but never verifies the new email?
- What happens when a user attempts to access protected pages while not logged in?
- What happens when a user's session expires while they're actively using the application?
- What happens when a user has JavaScript disabled in their browser?
- What happens when a user tries to create an account with an email from a disposable email service?
- What happens when a user's Google account is deleted after they've created a LeaveLab account with it?
- What happens when multiple tabs are open and the user logs out in one tab?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new users to create accounts using email address and password
- **FR-002**: System MUST validate email addresses using standard RFC 5322 format validation
- **FR-003**: System MUST enforce password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
- **FR-004**: System MUST send email verification links to users upon account creation
- **FR-005**: System MUST prevent unverified users from accessing protected platform features
- **FR-006**: System MUST allow users to create accounts and log in using Google OAuth
- **FR-007**: System MUST allow users to reset their password via email link
- **FR-008**: System MUST expire password reset links after 1 hour
- **FR-009**: System MUST invalidate previous password reset links when a new one is requested
- **FR-010**: System MUST allow authenticated users to log out
- **FR-011**: System MUST allow authenticated users to update their display name
- **FR-012**: System MUST allow authenticated users to upload and update their profile picture
- **FR-013**: System MUST allow authenticated users to change their email address with verification
- **FR-014**: System MUST allow authenticated users to change their password by providing their current password
- **FR-015**: System MUST display clear, user-friendly error messages for all authentication failures
- **FR-016**: System MUST display loading indicators during all asynchronous authentication operations
- **FR-017**: System MUST redirect unauthenticated users attempting to access protected pages to the login page
- **FR-018**: System MUST maintain user sessions across browser refreshes
- **FR-019**: System MUST display real-time validation feedback on form fields (email format, password strength)
- **FR-020**: System MUST prevent email enumeration attacks by showing generic messages for password reset requests
- **FR-021**: System MUST support profile picture uploads in JPG, PNG, and WebP formats with a maximum file size of 5MB
- **FR-022**: System MUST warn users when navigating away from forms with unsaved changes
- **FR-023**: System MUST allow users who signed up with Google OAuth to add email/password authentication as a backup
- **FR-024**: System MUST provide a "Remember me" option on the login form to extend session duration
- **FR-025**: System MUST allow users to terminate all active sessions from account settings
- **FR-026**: System MUST protect all user data with appropriate Row-Level Security policies ensuring users can only access their own data
- **FR-027**: System MUST log all authentication events (login, logout, failed attempts, password changes) for security auditing
- **FR-028**: System MUST provide GDPR-compliant data export and account deletion capabilities
- **FR-029**: System MUST display authentication forms optimised for mobile devices with touch-friendly input fields
- **FR-030**: System MUST support autofill for email and password fields on modern browsers
- **FR-031**: System MUST automatically link Google OAuth accounts to existing email/password accounts when the email addresses match
- **FR-032**: System MUST maintain standard user sessions for 7 days from last login
- **FR-033**: System MUST send security alert emails after 5 failed login attempts within 10 minutes, including details of failed attempts and password reset link

### Key Entities

- **User Account**: Represents a registered user. Key attributes include unique identifier, email address (unique), email verification status, password hash (for email/password auth), OAuth provider identifiers (for OAuth auth), account creation timestamp, last login timestamp, account status (active, suspended, deleted)

- **User Profile**: Represents a user's personal information. Key attributes include display name, profile picture URL, preferred language (defaulting to British English), timezone, onboarding completion status, membership tier (relationship to future membership feature)

- **Authentication Session**: Represents an active user session. Key attributes include session identifier, user identifier (foreign key to User Account), creation timestamp, expiration timestamp, device information (user agent, IP address for security auditing), "remember me" flag

- **Email Verification Token**: Represents a pending email verification. Key attributes include token (unique, cryptographically secure), user identifier, email address to verify, creation timestamp, expiration timestamp (24 hours from creation), verification status

- **Password Reset Token**: Represents a pending password reset request. Key attributes include token (unique, cryptographically secure), user identifier, creation timestamp, expiration timestamp (1 hour from creation), used status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New users can complete account creation from landing page to verified account in under 3 minutes (90th percentile)
- **SC-002**: 90% of users successfully complete their first login attempt without errors
- **SC-003**: Users can reset forgotten passwords and regain account access in under 5 minutes (90th percentile)
- **SC-004**: Authentication forms achieve a Lighthouse Accessibility score of 90 or higher
- **SC-005**: Login page loads and becomes interactive in under 2 seconds on 3G mobile networks (measured by Time to Interactive)
- **SC-006**: 95% of authentication operations (login, signup, password reset) complete within 3 seconds
- **SC-007**: Profile update operations save changes within 2 seconds of user submission
- **SC-008**: Zero security vulnerabilities related to authentication in penetration testing
- **SC-009**: 80% of users who start the signup process complete email verification within 24 hours
- **SC-010**: Password reset email delivery rate exceeds 98%
- **SC-011**: Mobile users can complete authentication flows without zooming or horizontal scrolling
- **SC-012**: Error messages are displayed within 500ms of user action
- **SC-013**: Support tickets related to account access reduced by 60% compared to baseline (after measuring baseline for one month post-launch)
- **SC-014**: 70% of new signups use Google OAuth (indicating frictionless flow is working)
- **SC-015**: Session persistence works correctly across 99.9% of login attempts (measured by automated tests)

## Assumptions

This specification makes the following assumptions:

1. **Email delivery**: A reliable email service provider (e.g., Resend, SendGrid) is available and configured for transactional emails
2. **HTTPS**: The platform is served over HTTPS for secure credential transmission
3. **Modern browsers**: Users are on browsers that support modern web standards (last 2 versions of major browsers)
4. **Google OAuth availability**: Google OAuth service maintains 99.9% uptime
5. **Password strength**: The specified password requirements (8+ characters, mixed case, number, special character) provide adequate security for the platform's risk profile
6. **Session duration**: Standard session duration of 7 days balances security and user convenience for LeaveLab's use case
7. **Profile picture storage**: Cloud storage is available for profile picture uploads with adequate capacity
8. **Security monitoring**: Email notifications are sufficient for alerting users to suspicious login activity (5+ failed attempts)
9. **Email verification window**: 24-hour verification link expiration provides adequate time while maintaining security
10. **Data residency**: Compliance with UK/EU data protection regulations is required given British English mandate
11. **Mobile platforms**: Both iOS Safari and Android Chrome must be fully supported given 75% mobile user base

## Dependencies

- Email service provider integration for transactional emails
- OAuth provider (Google) configuration and API access
- Cloud storage for profile picture uploads
- HTTPS/SSL certificates for secure authentication
- Authentication service (Supabase Auth) configuration

## Out of Scope

This feature specification explicitly excludes:

- Multi-factor authentication (MFA/2FA) - reserved for future security enhancement
- Social login providers other than Google (Facebook, Apple, etc.) - may be added in future iterations
- Account suspension/moderation workflows - separate admin feature
- User roles and permissions system - separate authorisation feature
- Third-party account linking (beyond Google OAuth) - future enhancement
- Biometric authentication (Face ID, Touch ID) - future mobile enhancement
- Password strength meter visual indicator (basic validation only) - UX enhancement for future iteration
- Activity log/audit trail in user UI - separate security feature
- Account recovery via SMS or security questions - email is the primary recovery method
- Federated identity/SSO for enterprise customers - future B2B feature
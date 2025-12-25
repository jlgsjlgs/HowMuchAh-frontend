# Changelog

All notable changes to this project will be documented in this file.

## [0.6.0] - 25-12-2025

### Added
- WebSocket context

### Changes
- Deprecated polling for new group invitations
- Implemented event-based websocket notification for group invitations

## [0.5.0] - 25-12-2025

### Added
- Settlement feature

## [0.4.1] - 24-12-2025

### Changes
- Changed `isSettled` to `settled` for `ExpenseSplitResponse`, to match Jackson serialization

## [0.4.0] - 24-12-2025

### Added
- Expense features in the expense page
  - Expense creation - supports three types of expense splits (equal, unequal, itemized)
  - Viewing all group expenses with pagination
  - Viewing individual expense details 
  - Expense deletion (only for expenses which have not been settled)
- Utility function for formatting currency and dates

### Changes
- Deprecated expense update API call since it was duplicating expense creation workflow

## [0.3.0] - 14-12-2025

### Added
- Invitation accept & decline feature

### Fixed
- Resolved some text overflow issues on smaller screens

## [0.2.0] - 14-12-2025

### Added
- Authenticated navigation bar
- `authService` now makes an API call to sync user credentials upon login
- Group features in the dashboard page
  - Group creation
  - Group setting modification features (change name/desc)
  - Group member features (View & kick members, view & revoke invitations, send invitation to group)
  - Group deletion feature
  - Group leave feature
- `useApiErrorHandler` hook to handle API errors

### Removed
- Removed `Zustand` as a dependency

### Fixed
- Resolved an issue with `AuthContext` that was causing logged in users to be stuck at "Loading..." page
- Resolved an issue with `AuthContext` that was repeatedly syncing user information with the server
- Downgraded `Zod` version due to some potential bug with `react-hook-form`

### Infrastructure
- Set up Supabase trigger to check whitelist table during first time login, rejects if email is not whitelisted

## [0.1.1] - 12-11-2025

### Fixed
- Login page now redirects authenticated users to dashboard automatically
- Prevents users from accessing login page when already logged in

## [0.1.0] - 12-11-2025

### Added
- Google SSO authentication via Supabase Auth 
- Protected routes with authentication guards
- Axios intercepters for automatic JWT token management
- Dashboard page

### Infrastructure
- Set up Supabase authentication
- Configured Google Cloud Console OAuth 2.0

## [0.0.0] - 04-11-2025

### Added 
- Initial project setup
- Non-protected pages (Landing, About, Login)
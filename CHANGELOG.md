# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### Added
- Authenticated navigation bar

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
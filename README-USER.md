# EpochEra Platform User Frontend

## Overview
This is the **USER-ONLY** frontend for the EpochEra platform. This application is designed for regular users to manage their Epoch token investments, transactions, and account activities.

## Access Control
- **USER ACCESS ONLY**: Only users with USER role can access this frontend
- **User Registration**: Supports new user registration and account creation
- **User Authentication**: Uses user-specific API endpoints for authentication
- **Role Validation**: All routes validate user role before granting access

## Features
- User Registration & Authentication
- User Dashboard
- Buy Epoch Tokens
- Wallet Management
- Transaction History
- Referral System
- Profile Management
- Support System
- Income Reports

## Security
- JWT token validation with user role verification
- Automatic redirect to signin for non-user accounts
- Session management with token expiration checks
- User-only API endpoints

## Getting Started
1. Access the application via web browser
2. Register a new account or sign in with existing credentials
3. Run `npm install`
4. Run `npm run dev`
5. Only USER role accounts will be granted access

## Important Notes
- This frontend does NOT support admin access
- All admin-related functionality has been removed
- Only user authentication and user features are available
- Attempting to access with admin credentials will result in access denial
- EpochEra is the platform name, Epoch is the token name
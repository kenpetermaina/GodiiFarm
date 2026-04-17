# Godwin Dairy Farm Management System

A comprehensive dairy farm management application built with React, Supabase, and Tailwind CSS.

## Features

- **Herd Management**: Track all cattle with details like tag number, breed, and health status.
- **Milk Production**: Log daily milk yields across morning, lunch, and evening sessions.
- **Feeding Records**: Monitor feed types and quantities for each cow.
- **Health Tracking**: Record illnesses, treatments, and vet visits.
- **Financials**: Manage expenses and income from milk sales.
- **Worker Management**: Keep track of farm staff and their roles.
- **Alerts & Reminders**: Never miss important farm tasks.

## Security Improvements

The authentication system has been hardened with the following features:

- **Enhanced Password Policy**: All new passwords must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
- **Password Strength Feedback**: Real-time visual feedback during signup and password reset to ensure users meet security requirements.
- **Double-Entry Verification**: "Confirm Password" fields added to prevent typos during account creation and password resets.
- **Visibility Control**: Password toggle to show/hide characters for better user experience while maintaining security.
- **Rate Limiting**: Client-side cooldowns implemented to mitigate brute-force and credential stuffing attempts.
- **Secure Password Resets**: Enhanced password recovery flow with strict validation.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Radix UI.
- **Backend**: Supabase (Auth, Database, Storage).
- **State Management**: Zustand with persistent storage.
- **Validation**: Custom validation logic with real-time feedback.

## Setup

1. Clone the repository.
2. Install dependencies: `npm install` or `bun install`.
3. Set up your Supabase project and add credentials to `.env`.
4. Run the development server: `npm run dev`.

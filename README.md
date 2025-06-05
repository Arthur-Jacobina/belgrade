# Privy + Supabase User Authentication Setup

This project demonstrates a complete user authentication system using Privy for wallet-based authentication and Supabase for user data management.

## 🚀 Quick Setup

### 1. Create Privy Project

1. Go to [Privy](https://privy.io) and create a new project
2. Note down your App ID from the dashboard
3. Configure your login methods (wallet, email, social)

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your Project URL and anon key from the API settings

### 3. Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Schema

Run this SQL in your Supabase SQL editor to create the users table:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  privy_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  wallet TEXT,
  organization_name TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_users_privy_id ON users(privy_id);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy to allow users to read their own data
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = privy_id);

-- Optional: Allow authenticated users to insert their own data
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = privy_id);
```

### 5. Install Dependencies

```bash
npm install @privy-io/react-auth zustand
# or
pnpm install @privy-io/react-auth zustand
```

### 6. Run the Application

```bash
npm run dev
# or
pnpm dev
```

## 📋 Features

### ✅ What's Included

- **Privy Authentication**: Wallet-based auth with embedded wallets, email, and social login
- **Zustand State Management**: Efficient state management with automatic Privy/Supabase sync
- **User Verification**: Automatic user lookup and creation flow
- **Real-time User Table**: View all users with auto-refresh
- **Token Management**: Built-in token refresh and error handling
- **Type Safety**: Full TypeScript support with proper interfaces

### 🔄 Architecture Overview

**Authentication Flow**:
1. User authenticates with Privy (wallet/email/social)
2. Privy user data is synced to Zustand store
3. System checks if user exists in Supabase
4. If new user, redirect to onboarding; if existing, redirect to dashboard
5. User data automatically stays in sync between Privy and Supabase

**State Management**:
- `useUser()` hook provides unified access to both Privy and Supabase user data
- Automatic sync between Privy authentication state and Supabase user records
- Built-in loading states and error handling

## 🛠️ Core Components

### useUser Hook
```typescript
const {
  isPrivyReady,           // Privy initialization status
  isAuthenticated,        // User authentication status
  privyUser,             // Privy user object
  userData,              // Supabase user data
  fetchUserData,         // Fetch user from Supabase
  logout,                // Logout function
  refreshToken,          // Token refresh
  fetchWithRefresh       // API calls with auto-refresh
} = useUser()
```

### User Store (Zustand)
```typescript
const {
  privyUser,             // Current Privy user
  userData,              // Current Supabase user data
  setPrivyUser,          // Update Privy user
  setUserData,           // Update Supabase user data
  clearUser,             // Clear all user data
  fetchUserData,         // Fetch user by Privy ID
  isLoadingUserData      // Loading state
} = useUserStore()
```

## 📊 Database Operations

### User Verification
```typescript
const userData = await fetchUserData(privyUser.id)
if (userData) {
  // User exists, redirect to dashboard
} else {
  // User doesn't exist, redirect to onboarding
}
```

### User Creation
```typescript
const newUser = await createUser({
  privyId: privyUser.id,
  fullName: 'John Doe',
  email: privyUser.email?.address || '',
  wallet: privyUser.wallet?.address,
  organizationName: 'My Org'
})
```

## 🔐 Security Considerations

1. **Privy Security**: Inherits Privy's security model with secure wallet management
2. **Row Level Security**: Enable RLS policies for production
3. **Token Management**: Built-in token refresh and automatic logout on failure
4. **Environment Variables**: Keep your Privy App ID and Supabase keys secure
5. **Data Validation**: Always validate data on both client and server

## 🎯 Benefits of This Approach

1. **Modern Web3 Auth**: Native wallet support with fallbacks to traditional methods
2. **Simplified State Management**: Single source of truth with automatic sync
3. **Better UX**: Seamless authentication flow with embedded wallets
4. **Scalable Architecture**: Clean separation between auth and data layers
5. **Type Safety**: Full TypeScript support throughout the stack
6. **Real-time Features**: Built-in real-time capabilities with Supabase

## 📝 Next Steps

1. Configure your Privy login methods in the Privy dashboard
2. Set up Row Level Security policies in Supabase
3. Add user roles and permissions
4. Implement user profile editing functionality
5. Add organization management features
6. Set up user avatar uploads with Supabase Storage
7. Add push notifications for user activities 
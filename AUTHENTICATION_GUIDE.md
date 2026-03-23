# Authentication & User Account Management Guide

## Overview

Your Swimmer Pro app now has **full user account management** with authentication powered by Supabase. Each user has their own isolated data that syncs across devices.

## Features Implemented

### ✅ User Registration & Login
- **Sign Up**: Create new accounts with email, password, and name
- **Sign In**: Secure login with email and password
- **Session Management**: Automatic session detection and persistence
- **Auto-Login**: Users stay logged in across browser sessions

### ✅ Personal Data Isolation
- Each user's workouts, meals, and metrics are stored separately
- Data is synced to Supabase backend using the KV store
- No data sharing between users

### ✅ Cross-Device Synchronization
- All data automatically saves to the cloud every 2 seconds after changes
- Load your data from any device by logging in
- Real-time sync when completing workouts or meals

### ✅ Profile Management
- Update your name and daily calorie target
- View account information
- Secure logout functionality

### ✅ Data Security
- Passwords are securely hashed by Supabase
- Access tokens used for API authentication
- Email auto-confirmed (no email server required for prototyping)

## How It Works

### Authentication Flow

1. **New User**:
   - Navigate to `/signup`
   - Enter name, email, and password
   - Account created on Supabase
   - Automatically logged in and redirected to dashboard

2. **Returning User**:
   - Navigate to `/login`
   - Enter email and password
   - User data loaded from server
   - Redirected to dashboard

3. **Protected Routes**:
   - Main app routes require authentication
   - Unauthenticated users redirected to login
   - Session checked on app load

### Data Storage

**Backend (Supabase)**:
- User credentials and metadata stored in Supabase Auth
- User data (workouts, meals, metrics) stored in KV store
- Key format: `user:{userId}:data`

**Frontend (Zustand + localStorage)**:
- Local state for fast UI updates
- Persisted to localStorage for offline access
- Auto-syncs to backend when online

### API Endpoints

The server (`/supabase/functions/server/index.tsx`) provides:

1. **POST /make-server-29992991/signup**
   - Create new user account
   - Requires: email, password, name

2. **GET /make-server-29992991/user/data**
   - Load user's data from server
   - Requires: Authorization header with access token

3. **POST /make-server-29992991/user/data**
   - Save user's data to server
   - Requires: Authorization header with access token

4. **PUT /make-server-29992991/user/profile**
   - Update user profile (name, image)
   - Requires: Authorization header with access token

## Using the App

### First Time Setup

1. Open the app in your browser
2. Click "Sign up" on the login page
3. Fill in your details:
   - Full Name: Your display name
   - Email: Your email address
   - Password: Min 6 characters
4. Click "Create Account"
5. You'll be logged in automatically!

### Daily Use

1. Open the app
2. Your session persists - you'll be logged in automatically
3. All your data loads from the cloud
4. Make changes to workouts, meals, or metrics
5. Data auto-saves every 2 seconds

### Managing Your Profile

1. Tap the "Profile" icon in the bottom navigation
2. Update your name or calorie target
3. Click "Save Changes"
4. Click "Logout" to sign out

## Running Locally

When you export and run this app on your Kali Linux machine:

### Prerequisites
```bash
# Install Node.js and pnpm (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm
```

### Setup
```bash
# Extract your downloaded project
unzip swimmer-pro-app.zip -d swimmer-app
cd swimmer-app

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Access
- Open browser to `http://localhost:5173`
- All Supabase features work automatically!
- Create an account and start using the app

## Important Notes

### Data Persistence
- **Online**: Data syncs to Supabase cloud
- **Offline**: Data saved to localStorage
- **Sync**: Auto-syncs when connection restored

### Security Considerations
⚠️ **This is a prototype/development app**:
- Email confirmation is auto-enabled (no email verification)
- Suitable for development and testing
- **NOT meant for production or sensitive data**
- Figma Make is not intended for collecting PII

### Multi-Device Usage
1. Sign up on one device
2. Log in with same credentials on another device
3. All your data will be there!

## Troubleshooting

### Can't log in?
- Check email and password are correct
- Ensure you've created an account first
- Clear browser cache and try again

### Data not syncing?
- Check browser console for errors
- Ensure internet connection is active
- Try logging out and back in

### Session expired?
- Just log in again
- Your data is safe in the cloud

## Technical Details

### State Management (Zustand)
```typescript
interface AppStore {
  // Authentication
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  
  // Methods
  setAuthState: (token, user) => void;
  logout: () => void;
  loadUserData: (token) => Promise<void>;
  saveUserData: () => Promise<void>;
}
```

### Auto-Save Hook
```typescript
// Debounced save every 2 seconds after changes
useAutoSave(); // Used in Layout component
```

### Session Check
```typescript
// On app load, check for existing Supabase session
const { data: { session } } = await supabase.auth.getSession();
```

## Files Modified/Created

### New Files
- `/src/utils/supabase/client.ts` - Supabase client singleton
- `/src/app/views/Login.tsx` - Login page
- `/src/app/views/Signup.tsx` - Signup page
- `/src/app/views/Profile.tsx` - Profile/settings page
- `/src/app/hooks/useAutoSave.ts` - Auto-save hook

### Modified Files
- `/src/app/store/useAppStore.ts` - Added auth state and sync methods
- `/src/app/routes.ts` - Added auth routes
- `/src/app/Layout.tsx` - Session check and auto-save
- `/src/app/components/BottomNav.tsx` - Added profile tab
- `/src/app/views/Dashboard.tsx` - Show authenticated user name
- `/supabase/functions/server/index.tsx` - Auth endpoints

## Next Steps

Want to enhance the authentication system? Consider:

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Profile picture upload
- [ ] Account deletion
- [ ] OAuth login (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] Activity history/audit log

Enjoy your fully functional authentication system! 🏊‍♂️💙

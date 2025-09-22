# 🔐 Google OAuth Testing Setup Guide

## Prerequisites
- Google Cloud Console account
- Supabase project access
- Local development environment

## 1. Google Cloud Console Setup

### Step 1: Create OAuth Credentials
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Go to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "OAuth 2.0 Client IDs"
4. Configure:
   - **Application type**: Web application
   - **Name**: Kanji Learning Local Dev
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/auth/callback
     http://localhost:3001/auth/callback
     http://localhost:3002/auth/callback
     http://localhost:3003/auth/callback
     https://kvrsikfmhhppxikbnbzu.supabase.co/auth/v1/callback
     ```

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type
3. Fill required fields:
   - **App name**: Kanji Learning App
   - **User support email**: your-email@domain.com
   - **Developer contact**: your-email@domain.com
4. Add scopes: `email`, `profile`
5. Add test users (your email address)

## 2. Supabase Configuration

### Step 1: Enable Google Provider
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `kvrsikfmhhppxikbnbzu`
3. Navigate: **Authentication** > **Providers** > **Google**
4. Toggle **Enable Google provider**

### Step 2: Add OAuth Credentials
```
Client ID: [From Google Cloud Console]
Client Secret: [From Google Cloud Console]
```

### Step 3: Configure Redirect URLs
Add these URLs in Supabase Auth settings:
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
http://localhost:3003/auth/callback
```

## 3. Local Testing Environment

### Environment Variables
Verify these exist in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kvrsikfmhhppxikbnbzu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2cnNpa2ZtaGhwcHhpa2JuYnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0Mjc3MjIsImV4cCI6MjA3NDAwMzcyMn0.v5HaWAqym7q-Eb0JKjjlU4XC59yiAjANpiiUZJh32mo
```

### Testing Commands
```bash
# Start development server
npm run dev

# Test build (to catch issues early)
npm run build

# Check for TypeScript errors
npm run type-check
```

## 4. Testing Procedure

### Manual Testing Steps
1. **Start dev server**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Click "Sign in"** button in header
4. **Expected flow**:
   - Redirects to Google OAuth consent screen
   - User selects Google account
   - User grants permissions
   - Redirects back to `/auth/callback`
   - Automatically redirects to home page
   - User avatar appears in header
   - "Sign in" button becomes "Sign Out"

### Debugging Common Issues

#### Issue: "Redirect URI Mismatch"
**Solution**: Ensure all redirect URIs are added to both:
- Google Cloud Console OAuth credentials
- Supabase Auth provider settings

#### Issue: "OAuth Consent Screen Not Configured"
**Solution**: Complete OAuth consent screen setup in Google Cloud Console

#### Issue: "Invalid Client ID"
**Solution**: Verify Client ID matches between Google Cloud Console and Supabase

#### Issue: "This app isn't verified"
**Solution**: For testing, click "Advanced" > "Go to app (unsafe)"

### Testing Different Scenarios

#### Test Case 1: First-time Login
1. Use incognito/private browsing
2. Complete full OAuth flow
3. Verify user data is stored in Supabase
4. Check progress tracking works

#### Test Case 2: Returning User
1. Sign in with same account
2. Verify existing progress is loaded
3. Test progress synchronization

#### Test Case 3: Sign Out
1. Click "Sign Out" button
2. Verify user is logged out
3. Verify progress reverts to local storage

## 5. Production Considerations

### Before Deployment
1. **Update redirect URIs** for production domain
2. **Verify OAuth consent screen** for production use
3. **Test with real users** (not just test users)
4. **Monitor authentication metrics** in Supabase

### Security Checklist
- [ ] OAuth credentials secured
- [ ] Redirect URIs limited to known domains
- [ ] Supabase RLS policies configured
- [ ] User data properly sanitized

## 6. Troubleshooting Tools

### Browser Developer Tools
```javascript
// Check auth state in browser console
console.log(await supabase.auth.getSession())
console.log(await supabase.auth.getUser())
```

### Supabase Auth Logs
1. Go to Supabase Dashboard
2. Navigate: **Authentication** > **Logs**
3. Monitor real-time auth events

### Network Tab Analysis
1. Open browser DevTools > Network
2. Filter for "auth" requests
3. Check for failed requests or error responses

## 7. Quick Verification Commands

```bash
# Check if environment variables are loaded
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
curl -X GET 'https://kvrsikfmhhppxikbnbzu.supabase.co/rest/v1/' \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Verify local server is running
curl http://localhost:3000/api/health
```

## Success Indicators ✅

When everything is working correctly, you should see:
- [ ] Sign-in button is clickable and not grayed out
- [ ] Clicking sign-in opens Google OAuth popup/redirect
- [ ] Successful authentication shows user avatar
- [ ] Overall progress tracking appears for signed-in users
- [ ] Sign-out functionality works properly
- [ ] No console errors related to authentication

## Support Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
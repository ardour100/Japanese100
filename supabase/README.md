# Supabase Local Development Setup

## Quick Start

1. **Copy the example config:**
   ```bash
   cp config.toml.example config.toml
   ```

2. **Set up your Google OAuth credentials:**
   - Create a `.env` file in the project root (already in `.gitignore`)
   - Add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

   ```env
   SUPABASE_AUTH_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   SUPABASE_AUTH_GOOGLE_SECRET=your-client-secret
   ```

3. **Start Supabase:**
   ```bash
   supabase start
   ```

## Files Overview

- `config.toml` - Your local configuration (DO NOT COMMIT - in `.gitignore`)
- `config.toml.example` - Template for other developers (SAFE TO COMMIT)
- `migrations/` - Database schema migrations (SAFE TO COMMIT)

## Security Note

The `config.toml` file uses environment variable substitution:
```toml
client_id = "env(SUPABASE_AUTH_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_GOOGLE_SECRET)"
```

This means the actual credentials are stored in `.env` (which is gitignored) and referenced in the config file.

**Never commit actual credentials to version control!**

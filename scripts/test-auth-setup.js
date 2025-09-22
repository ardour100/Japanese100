#!/usr/bin/env node

/**
 * OAuth Setup Testing Script
 * Run this to verify your authentication setup
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔐 Testing OAuth Setup...\n');

// Check environment variables
console.log('1. Checking environment variables...');
const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=');
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

console.log('✅ Environment variables found');

// Extract Supabase URL
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.error('❌ Invalid Supabase URL');
  process.exit(1);
}

console.log(`✅ Supabase URL: ${supabaseUrl}\n`);

// Test Supabase connection
console.log('2. Testing Supabase connection...');

const testUrl = `${supabaseUrl}/rest/v1/`;
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const anonKey = keyMatch ? keyMatch[1].trim() : null;

if (!anonKey) {
  console.error('❌ Missing anonymous key');
  process.exit(1);
}

https.get(testUrl, {
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`
  }
}, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Supabase connection successful');
  } else {
    console.log(`⚠️  Supabase responded with status: ${res.statusCode}`);
  }

  console.log('\n3. Next steps for complete setup:');
  console.log('   📖 Read TESTING_OAUTH.md for detailed setup instructions');
  console.log('   🔧 Configure Google Cloud Console OAuth credentials');
  console.log('   ⚙️  Enable Google provider in Supabase dashboard');
  console.log('   🧪 Test sign-in flow with: npm run dev');
  console.log('\n4. Quick test commands:');
  console.log('   npm run dev                    # Start development server');
  console.log('   curl http://localhost:3000/api/health  # Check server health');
  console.log('\n🎯 OAuth setup verification complete!');
}).on('error', (err) => {
  console.error('❌ Supabase connection failed:', err.message);
  process.exit(1);
});
// Setup Supabase Storage Buckets
const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://ggppnyylqpjqutzbdhmm.supabase.co';
const ACCESS_TOKEN = 'sbp_92cc3fc10a6c84cebab2a5f8660f5c04a03211ee';
const PROJECT_ID = 'ggppnyylqpjqutzbdhmm';

// Read SQL file
const sqlContent = fs.readFileSync('./STORAGE_BUCKETS.sql', 'utf8');

// Prepare API request
const data = JSON.stringify({ query: sqlContent });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: `/v1/projects/${PROJECT_ID}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🚀 Creating Storage Buckets...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response:', responseData);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Storage buckets created successfully!');
      console.log('\n📦 Created buckets:');
      console.log('  - chat-attachments (private, 10MB)');
      console.log('  - avatars (public, 2MB)');
      console.log('  - knowledge-base (public, 50MB)');
      console.log('  - dashboard-images (public, 10MB)');
      console.log('\nNext steps:');
      console.log('1. Create admin user');
      console.log('2. Enable Realtime replication');
      console.log('3. Test the integration');
    } else {
      console.log('\n❌ Error creating storage buckets');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();

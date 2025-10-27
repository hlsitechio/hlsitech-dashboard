// Setup Supabase Database Schema
const fs = require('fs');
const https = require('https');

const SUPABASE_URL = 'https://ggppnyylqpjqutzbdhmm.supabase.co';
const ACCESS_TOKEN = 'sbp_92cc3fc10a6c84cebab2a5f8660f5c04a03211ee';
const PROJECT_ID = 'ggppnyylqpjqutzbdhmm';

// Read SQL file
const sqlContent = fs.readFileSync('./DATABASE_SCHEMA.sql', 'utf8');

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

console.log('🚀 Executing DATABASE_SCHEMA.sql...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response:', responseData);

    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ Database schema executed successfully!');
      console.log('\nNext steps:');
      console.log('1. Execute STORAGE_BUCKETS.sql');
      console.log('2. Create admin user');
      console.log('3. Enable Realtime replication');
    } else {
      console.log('\n❌ Error executing schema');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(data);
req.end();

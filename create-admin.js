// Create Admin User in Supabase Auth
const https = require('https');

const SUPABASE_URL = 'https://ggppnyylqpjqutzbdhmm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdncHBueXlscXBqcXV0emJkaG1tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQzOTUzMSwiZXhwIjoyMDc3MDE1NTMxfQ.QJgPoyhoRNI2OZ0gCzfdCeV7cvlW7s3FuH_-4bIsdd8';

// Create admin user
const userData = JSON.stringify({
  email: 'info@hlsitech.com',
  password: 'Wintersun6?6',
  email_confirm: true,
  user_metadata: {
    name: 'HLS iTech Admin',
    role: 'admin'
  }
});

const options = {
  hostname: 'ggppnyylqpjqutzbdhmm.supabase.co',
  port: 443,
  path: '/auth/v1/admin/users',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'apikey': SERVICE_ROLE_KEY,
    'Content-Type': 'application/json',
    'Content-Length': userData.length
  }
};

console.log('🔐 Creating admin user...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);

    try {
      const parsedResponse = JSON.parse(responseData);

      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✅ Admin user created successfully!');
        console.log('\n📧 Login Credentials:');
        console.log('  Email: info@hlsitech.com');
        console.log('  Password: Wintersun6?6');
        console.log('  User ID:', parsedResponse.id);
        console.log('\n🔗 Dashboard: https://hlsitech-dashboard.netlify.app/login');
        console.log('\nNext steps:');
        console.log('1. Enable Realtime replication (conversations, messages, sessions)');
        console.log('2. Configure Netlify environment variables');
        console.log('3. Test login and live chat');
      } else if (res.statusCode === 422 && parsedResponse.msg && parsedResponse.msg.includes('already been registered')) {
        console.log('\n⚠️  Admin user already exists!');
        console.log('\n📧 Login Credentials:');
        console.log('  Email: info@hlsitech.com');
        console.log('  Password: Wintersun6?6');
        console.log('\n🔗 Dashboard: https://hlsitech-dashboard.netlify.app/login');
      } else {
        console.log('\n❌ Error creating admin user');
        console.log('Response:', parsedResponse);
      }
    } catch (e) {
      console.log('Raw Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(userData);
req.end();

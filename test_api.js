const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('https://fadyvaccines-production.up.railway.app/users/signup', {
      name: "Test User",
      email: `test_${Date.now()}@example.com`,
      password: "password123",
      cPassword: "password123",
      phone: "0123456789",
      gender: "male"
    });
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testSignup();

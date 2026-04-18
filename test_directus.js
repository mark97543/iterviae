const fetch = require('node-fetch');

async function test() {
    const email = "test_agent_" + Date.now() + "@test.com";
    const password = "password123";
    
    // Register
    const regRes = await fetch('https://api.wade-usa.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            first_name: "Agent",
            email: email,
            password: password,
            role: '3ae1aaa8-966b-4022-a39f-e5abe29b57b3',
            status: 'unverified'
        })
    });
    console.log("Register Status:", regRes.status);
    const regText = await regRes.text();
    console.log("Register Response:", regText);

    // Login
    const loginRes = await fetch('https://api.wade-usa.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    console.log("Login Status:", loginRes.status);
    const loginData = await loginRes.json();
    
    if (loginData?.data?.access_token) {
        const token = loginData.data.access_token;
        // Fetch /users/me
        const meRes = await fetch('https://api.wade-usa.com/users/me?fields=*', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Me Status:", meRes.status);
        console.log("Me Data:", await meRes.text());
    }
}
test();

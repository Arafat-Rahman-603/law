async function testEndpoints() {
  console.log('Testing /api/search...');
  const searchRes = await fetch('http://localhost:3001/api/search?q=bangladesh');
  if (!searchRes.ok) {
    console.error('Search failed:', searchRes.status, await searchRes.text());
  } else {
    const searchData = await searchRes.json();
    console.log('Search success, results count:', searchData.results?.length);
  }

  console.log('Testing /api/chat...');
  const chatRes = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'What is the labor act?' }] })
  });
  if (!chatRes.ok) {
    console.error('Chat failed:', chatRes.status, await chatRes.text());
  } else {
    console.log('Chat success!');
  }
}

testEndpoints().catch(console.error);

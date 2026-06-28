async function globalSetup() {
  console.log('Wiping test database...');
  
  const response = await fetch('http://localhost:8000/api/testing/reset-db', {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to reset the database! Is your backend running in test mode?');
  }
  console.log('Test database ready.');
}

export default globalSetup;
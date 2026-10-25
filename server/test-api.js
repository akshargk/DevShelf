// Automated API verification script for DevShelf
const assert = require('assert');
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting DevShelf API & Database Verification Tests...\n');

  // Test 1: Health Check
  console.log('1. Testing /api/health endpoint...');
  const health = await request('/health');
  assert.strictEqual(health.status, 200);
  assert.strictEqual(health.data.status, 'ok');
  assert.strictEqual(health.data.database_postgresql, 'connected');
  console.log('   ✓ Health check passed, PostgreSQL connected.\n');

  // Test 2: Auth Login with seeded user
  console.log('2. Testing /api/auth/login with demo account...');
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'alex@example.com', password: 'password123' },
  });
  assert.strictEqual(loginRes.status, 200);
  assert(loginRes.data.token, 'Should return JWT token');
  const token = loginRes.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };
  console.log('   ✓ Login passed. Token acquired.\n');

  // Test 3: Auth Validation & Invalid Login
  console.log('3. Testing /api/auth/login with invalid password & unregistered email...');
  const badLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'alex@example.com', password: 'wrongpassword' },
  });
  assert.strictEqual(badLogin.status, 401);
  assert.strictEqual(badLogin.data.message, 'Incorrect password. Please try again.');
  console.log('   ✓ Incorrect password correctly rejected (401: "Incorrect password. Please try again.").');

  const unregLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'nonexistent@example.com', password: 'password123' },
  });
  assert.strictEqual(unregLogin.status, 401);
  assert.strictEqual(unregLogin.data.message, 'No account found with this email.');
  console.log('   ✓ Unregistered email correctly rejected (401: "No account found with this email.").\n');

  // Test 4: Protected route access (/api/auth/me)
  console.log('4. Testing /api/auth/me (Protected Route)...');
  const meRes = await request('/auth/me', { headers: authHeaders });
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meRes.data.user.email, 'alex@example.com');
  console.log('   ✓ User profile retrieved successfully.\n');

  // Test 5: Fetch all snippets
  console.log('5. Testing GET /api/snippets (Module 1 & 2 PostgreSQL + Prisma)...');
  const snippetsRes = await request('/snippets', { headers: authHeaders });
  assert.strictEqual(snippetsRes.status, 200);
  assert(snippetsRes.data.snippets.length >= 5, 'Should have at least 5 seeded snippets');
  console.log(`   ✓ Retrieved ${snippetsRes.data.snippets.length} snippets.\n`);

  // Test 6: Search snippets by code
  console.log('6. Testing GET /api/snippets?search=HashMap...');
  const searchRes = await request('/snippets?search=HashMap', { headers: authHeaders });
  assert.strictEqual(searchRes.status, 200);
  assert(searchRes.data.snippets.some((s) => s.title.includes('HashMap')));
  console.log('   ✓ Search by title/code works accurately.\n');

  // Test 7: Filter by language
  console.log('7. Testing GET /api/snippets?language=python...');
  const pythonRes = await request('/snippets?language=python', { headers: authHeaders });
  assert.strictEqual(pythonRes.status, 200);
  assert(pythonRes.data.snippets.every((s) => s.language === 'python'));
  console.log('   ✓ Language filter works accurately.\n');

  // Test 8: Filter by favorites
  console.log('8. Testing GET /api/snippets?favorite=true...');
  const favRes = await request('/snippets?favorite=true', { headers: authHeaders });
  assert.strictEqual(favRes.status, 200);
  assert(favRes.data.snippets.every((s) => s.isFavorite === true));
  console.log(`   ✓ Favorites filter returned ${favRes.data.snippets.length} favorite snippets.\n`);

  // Test 9: Create new snippet
  console.log('9. Testing POST /api/snippets...');
  const newSnippetRes = await request('/snippets', {
    method: 'POST',
    headers: authHeaders,
    body: {
      title: 'Quicksort Algorithm in C++',
      language: 'cpp',
      code: 'void quickSort(int arr[], int low, int high) { /* partition */ }',
      description: 'Standard in-place recursive quicksort implementation.',
      tags: ['cpp', 'sorting', 'algorithm'],
    },
  });
  assert.strictEqual(newSnippetRes.status, 201);
  const createdSnippet = newSnippetRes.data.snippet;
  assert(createdSnippet.id, 'Should have assigned ID');
  console.log(`   ✓ Created snippet with ID ${createdSnippet.id}.\n`);

  // Test 10: Toggle favorite
  console.log('10. Testing PATCH /api/snippets/:id/favorite...');
  const toggleRes = await request(`/snippets/${createdSnippet.id}/favorite`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  assert.strictEqual(toggleRes.status, 200);
  assert.strictEqual(toggleRes.data.snippet.isFavorite, true);
  console.log('   ✓ Favorited successfully.\n');

  // Test 11: Update snippet and verify MongoDB revision archival (Module 3)
  console.log('11. Testing PUT /api/snippets/:id (and MongoDB Revision Archive)...');
  const updateRes = await request(`/snippets/${createdSnippet.id}`, {
    method: 'PUT',
    headers: authHeaders,
    body: {
      title: 'Optimized Quicksort in C++',
      language: 'cpp',
      code: 'void quickSort3Way(int arr[], int low, int high) { /* 3-way partition */ }',
      description: 'Updated with 3-way Dutch National Flag partitioning.',
      tags: ['cpp', 'sorting', 'algorithm', 'optimized'],
      changeNote: 'Upgraded partition logic to 3-way partitioning',
    },
  });
  assert.strictEqual(updateRes.status, 200);
  assert.strictEqual(updateRes.data.snippet.title, 'Optimized Quicksort in C++');
  console.log('   ✓ PostgreSQL snippet updated.\n');

  // Test 12: Verify MongoDB revision history
  console.log('12. Testing GET /api/snippets/:id/revisions (Module 3 MongoDB)...');
  const revRes = await request(`/snippets/${createdSnippet.id}/revisions`, {
    headers: authHeaders,
  });
  assert.strictEqual(revRes.status, 200);
  assert(revRes.data.revisions.length >= 2, 'Should have at least 2 revisions in MongoDB');
  console.log(`   ✓ MongoDB contains ${revRes.data.revisions.length} revision documents.`);
  console.log(`     - Latest revision archived: "${revRes.data.revisions[0].changeNote}"\n`);

  // Test 13: Delete snippet
  console.log('13. Testing DELETE /api/snippets/:id...');
  const deleteRes = await request(`/snippets/${createdSnippet.id}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert.strictEqual(deleteRes.status, 200);
  console.log('   ✓ Snippet deleted successfully.\n');

  console.log('🎉 ALL 13 TEST CASES PASSED! Every requirement is verified and operational.');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

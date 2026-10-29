/**
 * Integration Test: Health & System Diagnostics Endpoints
 */
const request = require('supertest');
const app = require('../src/server');

describe('System Health & Architectural Diagnostics API', () => {
  test('GET /health returns 200 with status UP and system info', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('service');
    expect(res.body).toHaveProperty('version', '1.0.0');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /api/health returns 200 with system diagnostics', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('uptimeSeconds');
  });

  test('GET /api/docs serves the Swagger interactive API documentation HTML', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Nexachain AI');
  });

  test('GET /unrecognized-route returns 404 with structured JSON error', async () => {
    const res = await request(app).get('/api/v1/invalid-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message');
  });
});

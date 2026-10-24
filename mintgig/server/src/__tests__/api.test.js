import request from 'supertest';
import app from '../app.js';

describe('mintGig Backend API Health & Security Tests', () => {
  it('GET /api/v1/health should return status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.app).toBe('mintGig API');
    expect(res.body.version).toBe('1.0.0');
  });

  it('GET /api/v1/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register with empty body should return 400 Validation Error', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
  });

  it('POST /api/v1/auth/register with short password should be rejected with 400', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Test Student',
      email: 'test@student.com',
      password: '123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/notifications without auth should return 401', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.statusCode).toBe(401);
  });

  it('GET /unknown-route should return 404', async () => {
    const res = await request(app).get('/api/v1/non-existent-endpoint');
    expect(res.statusCode).toBe(404);
  });
});

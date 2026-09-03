import { describe, it, expect } from'vitest';
import request from'supertest';
import app from'../src/app.js';

describe('Backend API Tests', () => {
  it('GET /health - returns ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: { status:'ok' },
    });
  });

  it('GET /videos - returns paginated videos', async () => {
    const res = await request(app).get('/videos?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.videos).toBeInstanceOf(Array);
    expect(res.body.data.videos.length).toBeLessThanOrEqual(10);
    expect(res.body.data.pagination).toHaveProperty('page', 1);
    expect(res.body.data.pagination).toHaveProperty('limit', 10);
  });

  it('GET /videos/:id - returns single video metadata', async () => {
    const res = await request(app).get('/videos/video-001');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('video-001');
    expect(res.body.data).toHaveProperty('videoUrl');
  });

  it('GET /videos/:id - returns 404 for unknown video', async () => {
    const res = await request(app).get('/videos/video-unknown-999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('POST /like - toggles like status and returns updated count', async () => {
    const testUserId = `test-user-${Date.now()}`;

    // Like
    const likeRes = await request(app)
      .post('/like')
      .send({ videoId:'video-001', userId: testUserId, action:'like' });
    expect(likeRes.status).toBe(200);
    expect(likeRes.body.success).toBe(true);
    expect(likeRes.body.data.liked).toBe(true);

    // Duplicate like
    const dupRes = await request(app)
      .post('/like')
      .send({ videoId:'video-001', userId: testUserId, action:'like' });
    expect(dupRes.status).toBe(200);
    expect(dupRes.body.data.liked).toBe(true);

    // Unlike
    const unlikeRes = await request(app)
      .post('/like')
      .send({ videoId:'video-001', userId: testUserId, action:'unlike' });
    expect(unlikeRes.status).toBe(200);
    expect(unlikeRes.body.data.liked).toBe(false);
  });

  it('POST /like - rejects invalid payload', async () => {
    const res = await request(app).post('/like').send({ videoId:'video-001', action:'invalid_action' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /share - updates share count', async () => {
    const res = await request(app)
      .post('/share')
      .send({ videoId:'video-001', platform:'copy_link' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.videoId).toBe('video-001');
    expect(res.body.data.platform).toBe('copy_link');
    expect(res.body.data).toHaveProperty('shares');
  });

  it('POST /share - rejects invalid platform', async () => {
    const res = await request(app)
      .post('/share')
      .send({ videoId:'video-001', platform:'unsupported_platform' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /videos/:videoId/comments - fetches comments', async () => {
    const res = await request(app).get('/videos/video-001/comments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('POST /videos/:videoId/comments - creates new comment', async () => {
    const res = await request(app)
      .post('/videos/video-001/comments')
      .send({ author:'Tester', message:'Awesome product demonstration!' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.author).toBe('Tester');
    expect(res.body.data.message).toBe('Awesome product demonstration!');
  });

  it('POST /videos/:videoId/comments - rejects empty message', async () => {
    const res = await request(app)
      .post('/videos/video-001/comments')
      .send({ author:'Tester', message:'' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /non-existent-route - returns 404', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

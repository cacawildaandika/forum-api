const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  describe('add comment', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'content comment here',
        },
      });

      // Action
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange;
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {

        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena properti yang dibutuhkan kurang');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange;
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'cacawildaandika',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'asdf',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena thread tidak ditemukan');
    });
  });

  describe('delete comment', () => {
    it('should response 404 when thread is not found', async () => {
      // eslint-disable-next-line no-undef
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123/comments/xxxx',
      });

      // Action
      const responseJson = JSON.parse(response.payload);

      console.log(responseJson);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when comment is not found', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxxx/comments/xxxx',
      });

      // Action
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should correct threads', async () => {
      // Arrange;
      await UsersTableTestHelper.addUser({});
      await ThreadTableTestHelper.addThread({});
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});

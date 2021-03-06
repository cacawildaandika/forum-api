const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('Thread Repository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add thread', () => {
    it('should persist thread', async () => {
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});

      await threadRepositoryPostgres.addThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'user-123',
      });

      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});

      const addedThread = await threadRepositoryPostgres.addThread({
        title: 'title thread',
        body: 'body thread',
        owner: 'user-123',
      });

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'title thread',
        owner: 'user-123',
      }));
    });
  });

  describe('find by id', () => {
    it('should throw InvariantError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {},
      );

      // Action & Assert
      return expect(threadRepositoryPostgres.getById('xx'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return thread id correctly', async () => {
      // Arrange
      const expectedData = {
        id: 'thread-123',
        title: 'asd',
        body: 'asd',
        username: 'andika',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => '123',
      );
      await UsersTableTestHelper.addUser({ id: 'user-123', username: expectedData.username });
      await ThreadsTableTestHelper.addThread({
        id: expectedData.id,
        title: expectedData.title,
        body: expectedData.body,
        user_id: 'user-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getById('thread-123');

      // Assert
      expect(thread.id).toBe('thread-123');
    });

    it('should return detail thread correctly', async () => {
      // Arrange
      const expectedData = new DetailThread({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Thread body',
        date: new Date().toDateString(),
        username: 'andika',
        comments: [],
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => '123',
      );
      await UsersTableTestHelper.addUser({ id: 'user-123', username: expectedData.username });
      await ThreadsTableTestHelper.addThread({
        id: expectedData.id,
        title: expectedData.title,
        body: expectedData.body,
        user_id: 'user-123',
      });

      // Action
      const thread = await threadRepositoryPostgres.getById('thread-123');

      // Assert
      expect(thread).toHaveProperty('id');
      expect(thread).toHaveProperty('title');
      expect(thread).toHaveProperty('body');
      expect(thread).toHaveProperty('username');
    });
  });
});

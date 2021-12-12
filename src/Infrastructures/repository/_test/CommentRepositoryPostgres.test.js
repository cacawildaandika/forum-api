const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('Comment Repository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add comment', () => {
    it('should persist comment', async () => {
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      await commentRepositoryPostgres.addComment({
        content: 'body comment',
        thread: 'thread-123',
        owner: 'user-123',
      });

      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: fakeIdGenerator,
      });

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addedComment = await commentRepositoryPostgres.addComment({
        content: 'body comment',
        thread: 'thread-123',
        owner: 'user-123',
      });

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'body comment',
        owner: 'user-123',
      }));
    });
  });

  describe('find by id', () => {
    it('should throw InvariantError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: () => {},
      });

      // Action & Assert
      return expect(commentRepositoryPostgres.getById('xx'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return comment id correctly', async () => {
      // Arrange
      const expectedData = {
        id: 'comment-123',
        content: 'asd',
        username: 'andika',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: () => '123',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123', username: expectedData.username });
      await ThreadsTableTestHelper.addThread({});
      await commentRepositoryPostgres.addComment({
        content: 'body comment',
        thread: 'thread-123',
        owner: 'user-123',
      });

      // Action
      const comment = await commentRepositoryPostgres.getById('comment-123');

      // Assert
      expect(comment.id).toBe('comment-123');
    });

    it('should return detail comment correctly', async () => {
      // Arrange
      const expectedData = new DetailComment({
        id: 'comment-123',
        content: 'Comment title',
        date: new Date().toDateString(),
        username: 'andika',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: () => '123',
      });
      await UsersTableTestHelper.addUser({ id: 'user-123', username: expectedData.username });
      await ThreadsTableTestHelper.addThread({});
      await commentRepositoryPostgres.addComment({
        content: 'body comment',
        thread: 'thread-123',
        owner: 'user-123',
      });

      // Action
      const comment = await commentRepositoryPostgres.getById('comment-123');

      // Assert
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('content');
      expect(comment).toHaveProperty('date');
      expect(comment).toHaveProperty('username');
    });
  });

  describe('delete comments', () => {
    it('should delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres({
        pool,
        idGenerator: () => '123',
      });

      await commentRepositoryPostgres.deleteComment('comment-123');

      await expect(commentRepositoryPostgres.getById('comment-123'))
        .rejects
        .toThrowError(InvariantError);
    });
  });
});

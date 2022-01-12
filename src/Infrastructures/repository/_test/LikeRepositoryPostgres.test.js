const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('Like Repository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add like', () => {
    it('should persist like', async () => {
      const fakeIdGenerator = () => '123';

      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      await likeRepositoryPostgres.addLike({
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        isLike: true,
      });

      const like = await LikesTableTestHelper.findById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('get last like user by comment and by thread', () => {
    it('should return empty object when data is not found', async () => {
      const fakeIdGenerator = () => '123';

      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      return expect(likeRepositoryPostgres.getLastLikeUser({ thread: 'xxx', comment: 'xxx', owner: 'xxx' }))
        .resolves
        .toStrictEqual({});
    });

    it('should return data correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      const fakeIdGenerator = () => '123';

      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const lastLike = await likeRepositoryPostgres.getLastLikeUser({ thread: 'thread-123', comment: 'comment-123', owner: 'user-123' });

      expect(lastLike).toHaveProperty('id');
      expect(lastLike).toHaveProperty('thread_id');
      expect(lastLike).toHaveProperty('comment_id');
      expect(lastLike).toHaveProperty('user_id');
      expect(lastLike).toHaveProperty('is_like');
    });
  });
});

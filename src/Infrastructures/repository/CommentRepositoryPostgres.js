const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

module.exports = class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, thread, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, thread_id, user_id',
      values: [id, content, thread, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getById(id) {
    const query = {
      text: 'SELECT comments.id, comments.content, comments.created_at, comments.deleted_at, users.username, users.id as user_id, comments.like_count as likeCount FROM ( SELECT * FROM comments WHERE id = $1) as comments INNER JOIN users ON comments.user_id = users.id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('DELETE_COMMENT_USE_CASE.NOT_FOUND');
    }

    return result.rows[0];
  }

  async deleteComment(id) {
    const query = {
      text: `UPDATE comments SET deleted_at='${new Date().toISOString().slice(0, 19).replace('T', ' ')}' WHERE id = $1`,
      values: [id],
    };

    await this._pool.query(query);
  }

  async getByThread(threadId) {
    const query = {
      text: 'SELECT comments.id, comments.content, comments.created_at, users.username, comments.deleted_at, comments.like_count as likeCount FROM ( SELECT * FROM comments WHERE thread_id = $1) as comments INNER JOIN users ON comments.user_id = users.id',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread not found');
    }

    return result.rows;
  }
};

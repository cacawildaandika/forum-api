const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

module.exports = class CommentRepositoryPostgres extends CommentRepository {
  constructor({ pool, idGenerator }) {
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
      text: 'SELECT comments.id, comments.content, comments.created_at, users.username FROM ( SELECT * FROM comments WHERE id = $1) as comments INNER JOIN users ON comments.user_id = users.id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread not found');
    }

    return new DetailComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      date: result.rows[0].created_at.toString(),
      username: result.rows[0].username,
    });
  }

  async deleteComment(id) {
    const query = {
      text: 'DELETE FROM comments WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);

    return true;
  }
};

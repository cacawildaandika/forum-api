const LikeRepository = require('../../Domains/likes/LikeRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');

module.exports = class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(addLike) {
    const {
      thread, comment, owner, isLike,
    } = addLike;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4, $5) RETURNING id, thread_id, comment_id, user_id, is_like',
      values: [id, thread, comment, owner, isLike],
    };

    await this._pool.query(query);

    return id;
  }

  async getLastLikeUser({ thread, comment, owner }) {
    const query = {
      text: 'SELECT likes.id, likes.thread_id, likes.comment_id, likes.user_id, likes.is_like FROM likes WHERE thread_id = $1 AND comment_id = $2 AND user_id = $3 ORDER BY created_at desc',
      values: [thread, comment, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return {};
    }

    return result.rows[0];
  }
};

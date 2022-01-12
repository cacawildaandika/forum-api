/* istanbul ignore file */
/* eslint-disable camelcase */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', thread_id = 'thread-123', comment_id = 'comment-123', user_id = 'user-123', is_like = true,
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3, $4, $5)',
      values: [id, thread_id, comment_id, user_id, is_like],
    };

    await pool.query(query);
  },

  async findById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;

const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

module.exports = class ThreadRepositoryPostgres extends ThreadRepository {
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body, owner } = addThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, body, user_id',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async getById(id) {
    const query = {
      text: 'SELECT threads.id, threads.title, threads.body, threads.user_id, threads.created_at, users.username FROM ( SELECT * FROM threads WHERE id = $1) as threads INNER JOIN users ON threads.user_id = users.id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread not found');
    }

    const queryComments = {
      text: 'SELECT comments.id, comments.content, comments.user_id, comments.thread_id, comments.created_at, users.username FROM ( SELECT * FROM comments WHERE thread_id = $1) as comments INNER JOIN users ON comments.user_id = users.id',
      values: [id],
    };

    const resultComments = await this._pool.query(queryComments);

    const comments = resultComments.rows.map((item) => new DetailComment({
      ...item,
      date: item.created_at,
    }));

    return new DetailThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].created_at.toString(),
      username: result.rows[0].username,
      comments,
    });
  }
};

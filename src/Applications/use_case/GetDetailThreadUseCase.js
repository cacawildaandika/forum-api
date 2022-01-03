const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const InvariantError = require('../../Commons/exceptions/InvariantError');

module.exports = class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    if (await this._threadRepository.verifyDeletedThread(id)) throw new Error('DETAIL_THREAD.DELETED');

    const detailThread = await this._threadRepository.getById(id);

    if (detailThread === null) throw new InvariantError('DETAIL_THREAD.NOT_FOUND');

    let comments = [];

    try {
      comments = await this._commentRepository.getByThread(id);

      comments = comments.map((item) => new DetailComment({
        id: item.id,
        username: item.username,
        date: item.created_at.toString(),
        content: item.deleted_at !== null ? '**komentar telah dihapus**' : item.content,
      }));
    } catch (e) {
      console.log(`thread ${id} doesn't have comment`);
    }

    return new DetailThread({
      ...detailThread,
      date: detailThread.created_at.toString(),
      comments,
    });
  }
};

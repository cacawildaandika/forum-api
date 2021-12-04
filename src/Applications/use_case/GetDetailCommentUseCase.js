const DetailComment = require('../../Domains/comments/entities/DetailComment');

module.exports = class GetDetailCommentUseCase {
  constructor({ commentRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(id) {
    const detailComment = await this._commentRepository.getById(id);

    if (detailComment === undefined) throw new Error('DETAIL_COMMENT.NOT_FOUND');
    if (detailComment.deleted_at === null || detailComment.deleted_at !== '') return 'comment is deleted';

    const detailUser = await this._userRepository.getById(detailComment.owner);

    return new DetailComment({
      id,
      username: detailUser.username,
      date: detailComment.created_at,
      content: detailComment.content,
    });
  }
};

class DetailComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.content;
    this.likeCount = payload.likeCount;
  }

  verifyPayload({
    id, username, date, content, likeCount,
  }) {
    if (!id || !username || !date || !content || likeCount === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || Number.isNaN(likeCount)) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;

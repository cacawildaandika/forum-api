class AddComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.content = payload.content;
  }

  verifyPayload({ content }) {
    if (!content) {
      throw new Error('COMMENT_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('COMMENT_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;

class AddedComment {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('COMMENT_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;

class LastLikeUser {
  constructor(payload) {
    this.verifyPayload(payload);

    this.thread = payload.thread;
    this.comment = payload.comment;
    this.owner = payload.owner;
  }

  verifyPayload({
    thread, comment, owner,
  }) {
    if (!thread || !comment || !owner) {
      throw new Error('LIKE_LAST.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string') {
      throw new Error('LIKE_LAST.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LastLikeUser;

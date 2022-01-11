class AddLike {
  constructor(payload) {
    this.verifyPayload(payload);

    this.thread = payload.thread;
    this.comment = payload.comment;
    this.owner = payload.owner;
    this.isLike = payload.isLike;
  }

  verifyPayload({
    thread, comment, owner, isLike,
  }) {
    if (!thread || !comment || !owner || !isLike) {
      throw new Error('LIKE_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof owner !== 'string' || typeof isLike !== 'boolean') {
      throw new Error('LIKE_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddLike;

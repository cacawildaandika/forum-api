class AddedThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.owner = payload.owner;
  }

  verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedThread;

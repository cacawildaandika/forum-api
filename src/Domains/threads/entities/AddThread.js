class AddThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;

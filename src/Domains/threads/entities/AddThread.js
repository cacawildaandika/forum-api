class AddThread {
  constructor(payload) {
    this.verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  verifyPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;

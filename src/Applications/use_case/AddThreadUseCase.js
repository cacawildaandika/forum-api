const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);
    const { title, body, owner } = useCasePayload;

    const addThread = new AddThread({ title, body, owner });

    return this._threadRepository.addThread(addThread);
  }

  verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('USE_CASE_ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddThreadUseCase;

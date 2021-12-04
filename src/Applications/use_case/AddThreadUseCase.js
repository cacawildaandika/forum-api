const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this.verifyPayload(useCasePayload);
    const { title, body, token } = useCasePayload;

    await this._authenticationRepository.checkAvailabilityToken(token);
    const { id } = await this._authenticationTokenManager
      .decodePayload(token);

    const addThread = new AddThread({ title, body, owner: id });
    return this._threadRepository.addThread(addThread);
  }

  verifyPayload({ title, body, token }) {
    if (!title || !body || !token) {
      throw new Error('USE_CASE_ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddThreadUseCase;

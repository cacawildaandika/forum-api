const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('AddThreadUseCase', () => {
  it('should return error when payload is not complete', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();
    const authenticationRepository = new AuthenticationRepository();
    const authenticationTokenManager = new AuthenticationTokenManager();
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository,
      authenticationRepository,
      authenticationTokenManager,
    });
    const payload = {
      title: 'title thread',
    };

    // Action & Assert
    await expect(addThreadUseCase.execute(payload)).rejects.toThrowError('USE_CASE_ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should orchestrating add thread function correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Thread title',
      body: 'Thread body',
      owner: 'user-123',
    };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    // Add thread dependency
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // Mock add thread function
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'andika' }));
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    // Use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({ title: useCasePayload.title, body: useCasePayload.body, owner: 'user-123' }));
  });
});

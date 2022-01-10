const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('AddThreadUseCase', () => {
  it('should return error when payload is not complete', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository,
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

    // Mock add thread function
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread));

    // Use case instance
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({ title: useCasePayload.title, body: useCasePayload.body, owner: 'user-123' }));
  });
});

const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment function correctly', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      content: 'Comment should here',
      thread: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.getById).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      content: useCasePayload.content,
      owner: 'user-123',
      thread: useCasePayload.thread,
    }));
  });

  it('should return error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      content: 'Comment should here',
      thread: 'thread-123',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(Error('thead not found')));

    // Generate use case instance
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrowError('USE_CASE_ADD_COMMENT.THREAD_NOT_FOUND');
  });
});

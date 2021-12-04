const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating add comment function correctly', async () => {
    // Arrange
    const useCasePayload = {
      token: 'userToken',
      thread: 'thread-123',
      comment: 'comment-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // Implement mock
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'andika' }));
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'content-123', thread: 'thread-123', owner: 'user-123',
      }));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const deleteComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deleteComment).toBe(true);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.comment);
  });
});

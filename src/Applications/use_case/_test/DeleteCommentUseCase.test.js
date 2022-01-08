const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('DeleteCommentUseCase', () => {
  it('should return error when thread is deleted', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(Error('thead not found')));

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should return error when payload is invalid', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(new Error('USE_CASE_DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'));
  });

  it('should return error when thread is not found', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError('DETAIL_THREAD.NOT_FOUND')));

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should return error when comment is not found', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCasePayload.thread, title: useCasePayload.thread, body: useCasePayload.thread, username: useCasePayload.thread, created_at: useCasePayload.thread, deleted_at: '',
      }));

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(undefined));

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(undefined));

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_FOUND');
  });

  it('should return unauthorized when user is not a owner comment', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCasePayload.thread, title: useCasePayload.thread, body: useCasePayload.thread, username: useCasePayload.thread, created_at: useCasePayload.thread, deleted_at: '',
      }));

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'comment is here', username: 'cacawildaandika', created_at: '2021-10-12 12:10:10', user_id: 'user-111',
      }));

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.UNAUTHORIZED');
  });

  it('should orchestrating add comment function correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCasePayload.thread, title: useCasePayload.thread, body: useCasePayload.thread, username: useCasePayload.thread, created_at: useCasePayload.thread, deleted_at: '',
      }));

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'comment is here', username: 'cacawildaandika', created_at: '2021-10-12 12:10:10', user_id: 'user-123',
      }));

    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    // Generate use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.toBe(true);
  });
});

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const AddLikeUseCase = require('../AddLikeDislikeUseCase');

describe('AddLikeDislikeUseCase', () => {
  it('should return error when payload is not complete', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      owner: 'user-123',
      comment: 'user-123',
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject());

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockLikeRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError('USE_CASE_ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return error when thread not found', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(Error('thead not found')));

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError('USE_CASE_ADD_LIKE.THREAD_NOT_FOUND');
  });

  it('should return error when comment not found', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('comment not found')));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError('USE_CASE_ADD_LIKE.COMMENT_NOT_FOUND');
  });

  it('should return error when comment is deleted', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'content comment', created_at: '2020-01-01 20:30:00', username: 'cacawildaandika', deleted_at: '2020-01-01 20:30:00',
      }));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await expect(addLikeUseCase.execute(useCasePayload)).rejects.toThrowError('USE_CASE_ADD_LIKE.COMMENT_DELETED');
  });

  it('should orchestrating AddLikeDislikeUseCase', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'content comment', created_at: '2020-01-01 20:30:00', username: 'cacawildaandika', deleted_at: '',
      }));

    mockLikeRepository.getLastLikeUser = jest.fn()
      .mockImplementation(() => Promise.resolve({
        thread_id: useCasePayload.thread, comment_id: useCasePayload.comment, user_id: useCasePayload.owner, isLike: true,
      }));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve('like-abc123'));

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const result = await addLikeUseCase.execute(useCasePayload);
    // Action
    await expect(result).toBe('like-abc123');
  });

  it('should orchestrating AddLikeDislikeUseCase when last like is null', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Generate Add Comment use case dependency
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'comment-123', content: 'content comment', created_at: '2020-01-01 20:30:00', username: 'cacawildaandika', deleted_at: '',
      }));

    mockLikeRepository.getLastLikeUser = jest.fn()
      .mockImplementation(() => Promise.resolve({}));

    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve('like-abc123'));

    // Generate use case instance
    const addLikeUseCase = new AddLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    const result = await addLikeUseCase.execute(useCasePayload);
    // Action
    await expect(result).toBe('like-abc123');
  });
});

const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('GetDetailThreadUseCase', () => {
  it('should return error when detail is not available', async () => {
    const id = 'xx';

    // Generate dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Fake implementation
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.reject(new InvariantError('DETAIL_THREAD.NOT_FOUND')));
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));

    // Generate use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(getDetailThreadUseCase.execute(id)).rejects.toThrowError('DETAIL_THREAD.NOT_FOUND');
    expect(mockThreadRepository.verifyDeletedThread).toBeCalledWith(id);
    expect(mockThreadRepository.getById).toBeCalledWith(id);
  });

  it('should return error when thread is deleted', async () => {
    const id = 'thread-123';

    // Generate dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Fake implementation
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    // Generate use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await expect(getDetailThreadUseCase.execute(id)).rejects.toThrowError('DETAIL_THREAD.DELETED');
    expect(mockThreadRepository.verifyDeletedThread).toBeCalledWith(id);
  });

  it('should return correct fields', async () => {
    const id = 'thread-123';

    const comments = new DetailComment({
      id: 'user-abc01',
      username: 'username',
      date: '2021-01-01 20:20:10',
      content: 'content',
      likeCount: '0',
    });

    const expectedThread = {
      id,
      title: 'title thread',
      body: 'body thread',
      date: '2021-01-01 20:20:10',
      username: 'username',
      comments: [
        comments,
      ],
    };

    // Generate dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Fake implementation
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id, title: expectedThread.title, body: expectedThread.body, username: expectedThread.username, created_at: expectedThread.date, deleted_at: '',
      }));
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.getByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'user-abc01',
          created_at: '2021-01-01 20:20:10',
          deleted_at: null,
          username: 'username',
          content: 'content',
          likeCount: 0,
        },
      ]));

    // Generate use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(id);

    expect(detailThread).toHaveProperty('id');
    expect(detailThread).toHaveProperty('title');
    expect(detailThread).toHaveProperty('body');
    expect(detailThread).toHaveProperty('date');
    expect(detailThread).toHaveProperty('username');
    expect(detailThread).toHaveProperty('comments');

    expect(detailThread.comments[0]).toHaveProperty('id');
    expect(detailThread.comments[0]).toHaveProperty('content');
    expect(detailThread.comments[0]).toHaveProperty('username');
    expect(detailThread.comments[0]).toHaveProperty('date');
    expect(detailThread.comments[0]).toHaveProperty('likeCount');

    expect(mockThreadRepository.verifyDeletedThread).toBeCalledWith(id);
    expect(mockThreadRepository.getById).toBeCalledWith(id);
    expect(mockCommentRepository.getByThread).toBeCalledWith(id);
  });

  it('should return deleted comment with note', async () => {
    const id = 'thread-123';

    const comments = new DetailComment({
      id: 'user-abc01',
      username: 'username',
      date: '2021-01-01 20:20:10',
      content: 'content',
      likeCount: 0,
    });

    const expectedThread = {
      id,
      title: 'title thread',
      body: 'body thread',
      date: '2021-01-01 20:20:10',
      username: 'username',
      comments: [
        comments,
      ],
    };

    // Generate dependencies
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Fake implementation
    mockThreadRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id, title: expectedThread.title, body: expectedThread.body, username: expectedThread.username, created_at: expectedThread.date, deleted_at: '',
      }));
    mockThreadRepository.verifyDeletedThread = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentRepository.getByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'user-abc01',
          created_at: '2021-01-01 20:20:10',
          username: 'username',
          content: 'content',
          deleted_at: '2021-01-01 20:20:10',
          likeCount: 0,
        },
      ]));

    // Generate use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await getDetailThreadUseCase.execute(id);

    expect(detailThread.comments[0].content).toBe('**komentar telah dihapus**');
    expect(mockThreadRepository.verifyDeletedThread).toBeCalledWith(id);
    expect(mockThreadRepository.getById).toBeCalledWith(id);
    expect(mockCommentRepository.getByThread).toBeCalledWith(id);
  });
});

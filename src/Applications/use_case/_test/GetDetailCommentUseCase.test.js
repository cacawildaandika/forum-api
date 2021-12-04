const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetDetailCommentUseCase = require('../GetDetailCommentUseCase');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('GetDetailCommentUseCase', () => {
  it('should return error when comment is not available', async () => {
    const id = 'xx';

    // Generate dependencies
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // Fake implementation
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve(undefined));
    mockUserRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123', username: 'exampleusername',
      }));

    // Generate use case instance
    const getDetailCommentUseCase = new GetDetailCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    await expect(getDetailCommentUseCase.execute(id)).rejects.toThrowError('DETAIL_COMMENT.NOT_FOUND');
  });

  it('should return error when comment deleted', async () => {
    const id = 'xx';

    // Generate dependencies
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // Fake implementation
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id, deleted_at: '2021-01-01 20:20:10' }));
    mockUserRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123', username: 'exampleusername',
      }));

    // Generate use case instance
    const getDetailCommentUseCase = new GetDetailCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    await expect(getDetailCommentUseCase.execute(id)).resolves.toBe('comment is deleted');
  });

  it('should return correct fields', async () => {
    const id = 'comment-123';

    const expectedComment = {
      id,
      username: 'usernamefromuser',
      date: '2021-01-01 20:20:10',
      content: 'Content comment',
    };

    // Generate dependencies
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // Fake implementation
    mockCommentRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id, content: expectedComment.content, thread: expectedComment.thread, owner: 'user-123', created_at: expectedComment.date, deleted_at: '',
      }));
    mockUserRepository.getById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'user-123', username: expectedComment.username,
      }));

    // Generate use case instance
    const getDetailCommentUseCase = new GetDetailCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    await expect(getDetailCommentUseCase.execute(id)).resolves.toStrictEqual(new DetailComment({
      id,
      username: expectedComment.username,
      content: expectedComment.content,
      date: expectedComment.date,
    }));
  });
});

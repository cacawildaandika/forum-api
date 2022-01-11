const AddLike = require('../AddLike');

describe('Add Like', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      thread: 'Title Thread A',
      comment: 'Title Thread A',
      owner: 'Title Thread A',
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('LIKE_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread',
      comment: 123,
      owner: true,
      isLike: 123,
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('LIKE_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create AddLike object correct', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Action
    const addLike = new AddLike(payload);

    expect(addLike.thread).toEqual(payload.thread);
    expect(addLike.comment).toEqual(payload.comment);
    expect(addLike.owner).toEqual(payload.owner);
    expect(addLike.isLike).toEqual(payload.isLike);
  });
});

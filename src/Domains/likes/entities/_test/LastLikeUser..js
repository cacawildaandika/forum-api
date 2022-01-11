const DetailLike = require('../LastLikeUser');

describe('Add Like', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      thread: 'Title Thread A',
      comment: 'Title Thread A',
      owner: 'Title Thread A',
    };

    // Action and Assert
    expect(() => new DetailLike(payload)).toThrowError('LIKE_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new DetailLike(payload)).toThrowError('LIKE_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create DetailLike object correct', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
      isLike: true,
    };

    // Action
    const detailLike = new DetailLike(payload);

    expect(detailLike.thread).toEqual(payload.thread);
    expect(detailLike.comment).toEqual(payload.comment);
    expect(detailLike.owner).toEqual(payload.owner);
    expect(detailLike.isLike).toEqual(payload.isLike);
  });
});

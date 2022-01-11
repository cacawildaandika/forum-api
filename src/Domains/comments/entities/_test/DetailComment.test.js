const DetailComment = require('../DetailComment');

describe('Detail Comment', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      id: '123',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      username: 123,
      date: [],
      content: 123,
      likeCount: '0',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create DetailComment object correct', () => {
    // Arrange
    const payload = {
      id: 'comment-_pby2_tmXV6bcvcdev8xk',
      username: 'johndoe',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      likeCount: '0',
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
  });
});

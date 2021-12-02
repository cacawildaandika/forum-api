const AddComment = require('../AddComment');

describe('Add Comment', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('COMMENT_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('COMMENT_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create AddComment object correct', () => {
    // Arrange
    const payload = {
      content: 'thread-abc01',
    };

    // Action
    const addedComment = new AddComment(payload);

    // Assert
    expect(addedComment.content).toEqual(payload.content);
  });
});

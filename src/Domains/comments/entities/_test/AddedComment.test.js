const AddedComment = require('../AddedComment');

describe('Add Comment', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      id: 'test-id',
      content: 'content should here',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('COMMENT_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      content: 123,
      owner: 'owner',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('COMMENT_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create AddedComment object correct', () => {
    // Arrange
    const payload = {
      id: 'id-here',
      content: 'thread-abc01',
      owner: 'owner',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});

const AddedThread = require('../AddedThread');

describe('Add Thread', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      title: 'Title Thread A',
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_ADDED.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: true,
      title: 123,
      owner: ['asd'],
    };

    // Action and Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_ADDED.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create AddedThread object correct', () => {
    // Arrange
    const payload = {
      id: 'thread-abc01',
      title: 'Title Thread A',
      owner: 'user-abc01',
    };

    // Action
    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});

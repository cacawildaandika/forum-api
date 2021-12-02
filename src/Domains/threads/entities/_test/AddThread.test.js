const AddThread = require('../AddThread');

describe('Add Thread', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      title: 'Title Thread A',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('THREAD_ADD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create AddThread object correct', () => {
    // Arrange
    const payload = {
      title: 'Title Thread A',
      body: 'Body Thread A',
    };

    // Action
    const addThread = new AddThread(payload);

    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});

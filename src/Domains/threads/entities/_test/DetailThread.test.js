const DetailThread = require('../DetailThread');

describe('Detail Thread', () => {
  it('should should error when payload did not contain body', () => {
    // Arrange
    const payload = {
      title: 'Title Thread A',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should should error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'asd',
      title: 123,
      body: true,
      date: 'asd',
      username: 'asd',
      comments: 'asd',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should should create DetailThread object correct', () => {
    // Arrange
    const payload = {
      id: 'asd',
      title: 'Title Thread A',
      body: 'Body Thread A',
      date: 'asd',
      username: 'asd',
      comments: [],
    };

    // Action
    const addThread = new DetailThread(payload);

    expect(addThread.id).toEqual(payload.id);
    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.date).toEqual(payload.date);
    expect(addThread.username).toEqual(payload.username);
    expect(addThread.comments).toEqual(payload.comments);
  });
});

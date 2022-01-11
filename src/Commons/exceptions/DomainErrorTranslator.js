const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'USE_CASE_ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidsak dapat membuat thread karena properti yang dibutuhkan kurang'),
  'USE_CASE_ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena properti yang dibutuhkan kurang'),
  'THREAD_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena data yang dikirimkan tidak valid'),
  'COMMENT_ADD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena data yang dikirimkan tidak valid'),
  'USE_CASE_ADD_COMMENT.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat comment karena thread tidak ditemukan'),
  'DETAIL_THREAD.NOT_FOUND': new NotFoundError('tidak dapat mengambil thread tidak ditemukan'),
  'DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena thread tidak ditemukan'),
  'DELETE_COMMENT_USE_CASE.NOT_FOUND': new NotFoundError('comment tidak dapat ditemukan'),
  'DELETE_COMMENT_USE_CASE.UNAUTHORIZED': new AuthorizationError('anda tidak berhak menghapus comment ini'),
  'USE_CASE_ADD_LIKE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menyukai comment karena thread tidak ditemukan'),
  'USE_CASE_ADD_LIKE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menyukai comment karena comment tidak ditemukan'),
  'USE_CASE_ADD_LIKE.COMMENT_DELETED': new NotFoundError('tidak dapat menyukai comment karena comment telah dihapus'),
  'USE_CASE_ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat menyukai comment karena properti yang dibutuhkan kurang'),
};

module.exports = DomainErrorTranslator;

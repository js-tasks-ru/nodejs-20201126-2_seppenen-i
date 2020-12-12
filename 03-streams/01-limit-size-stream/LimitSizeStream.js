const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');
//const { Buffer } = require('buffer');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalLength = 0;
  }

  _getChunkLength(chunk, encoding) {
    return Buffer.byteLength(chunk, encoding);
  }

  _isLimitExceed() {
    if (this.totalLength > this.limit) {
      return true;
    }
    return false;
  }

  _increaseTotalLength(length) {
    this.totalLength += length;
  }

  _transform(chunk, encoding, callback) {
    var length = this._getChunkLength(chunk, encoding);
    this._increaseTotalLength(length);
    if (this._isLimitExceed()) {
      //console.log(this.totalLength, ' ', this.limit);
      callback(new LimitExceededError(''));
      return;
    }
    this.push(chunk);
    callback();
    return;
  }
}
module.exports = LimitSizeStream;
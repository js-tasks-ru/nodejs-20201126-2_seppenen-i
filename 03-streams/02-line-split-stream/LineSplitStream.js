const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.chunkBuffer = '';
  }

  _getStringFromChunk(chunk) {
    return Buffer.from(chunk).toString();
  }

  _transform(chunk, encoding, callback) {
    var processingString = this.chunkBuffer + this._getStringFromChunk(chunk);
    var split = processingString.split(os.EOL);

    for (var i = 0; i < split.length - 1; i++) {
      //console.log(split[i]);
      this.push(split[i]);
    }
    this.chunkBuffer = split[split.length - 1];
    callback();

  }

  _flush(callback) {
    this.push(this.chunkBuffer);
    callback();
  }
}

module.exports = LineSplitStream;
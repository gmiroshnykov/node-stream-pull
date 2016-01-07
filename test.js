var assert = require('assert');
var streamBuffers = require('stream-buffers');

var streamPull = require('./index');

describe('streamPull', function() {
  it('should work', function(cb) {
    var input = new streamBuffers.ReadableStreamBuffer({chunkSize: 1});
    input.put('Hello World!');
    input.stop();

    streamPull(input, 5, function(err, content) {
      assert.ifError(err);
      assert.equal(content, 'Hello');

      var rest = new streamBuffers.WritableStreamBuffer();
      input.pipe(rest).on('finish', function() {
        assert.equal(rest.getContentsAsString(), ' World!');
        cb();
      });
    });
  });

  it('should fail if asked for more bytes than available', function(cb) {
    var input = new streamBuffers.ReadableStreamBuffer({chunkSize: 1});
    input.put('Hello World!');
    input.stop();

    streamPull(input, 15, function(err, content) {
      assert(err);
      assert.equal(err.message, 'asked for 15 bytes, but got 12');

      var rest = new streamBuffers.WritableStreamBuffer();
      input.pipe(rest).on('finish', function() {
        assert.equal(rest.getContentsAsString(), 'Hello World!');
        cb();
      });
    });
  });

  it('should work if asked for 0 bytes', function(cb) {
    var input = new streamBuffers.ReadableStreamBuffer({chunkSize: 1});
    input.put('Hello World!');
    input.stop();

    streamPull(input, 0, function(err, content) {
      assert.ifError(err);
      assert.equal(content, '');

      var rest = new streamBuffers.WritableStreamBuffer();
      input.pipe(rest).on('finish', function() {
        assert.equal(rest.getContentsAsString(), 'Hello World!');
        cb();
      });
    });
  });
});

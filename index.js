function streamPull(readable, size, callback) {

  function onDone(err, result) {
    readable.removeListener('readable', onReadable);
    readable.removeListener('error', onError);
    readable.removeListener('end', onEnd);
    return callback(err, result);
  }

  function onError(err) {
    return onDone(err);
  }

  function onEnd() {
    return onDone(new Error('stream ended, but too few bytes were pulled'));
  }

  function onReadable() {
    var chunk = readable.read(size);
    if (chunk === null) {
      return readable.once('readable', onReadable);
    } else if (chunk.length === size) {
      return onDone(null, chunk);
    } else {
      // undo the damage
      readable.unshift(chunk);
      return onDone(new Error('asked for ' + size + ' bytes, but got ' + chunk.length));
    }
  }

  readable.on('end', onEnd);
  readable.on('error', onError);

  if (size === 0) {
    return setImmediate(onDone, null, new Buffer(0));
  }

  setImmediate(onReadable);
}

module.exports = streamPull;

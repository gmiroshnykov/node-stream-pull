function streamPull(readable, size, callback) {
  if (size === 0) {
    return callback(null, new Buffer(0));
  }

  var chunk = readable.read(size);
  //console.log('streamPull:', chunk);
  if (chunk === null) {
    readable.once('readable', streamPull.bind(null, readable, size, callback));
  } else if (chunk.length === size) {
    return callback(null, chunk);
  } else {
    // undo the damage
    readable.unshift(chunk);
    return callback(new Error('asked for ' + size + ' bytes, but got ' + chunk.length));
  }
}

module.exports = streamPull;

const Hash = require('ipfs-only-hash');

export const generateIPFSHash = async (data, options) => {
  // options object has the key encoding which defines the encoding type
  // of the data string that has been passed in
  const bufferData = Buffer.from(data, options.encoding || 'ascii');
  const hash = await Hash.of(bufferData);
  return hash;
};

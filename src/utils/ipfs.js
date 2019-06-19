const Unixfs = require('ipfs-unixfs');
const { DAGNode } = require('ipld-dag-pb');

export const generateIPFSHash = async (data, options) => {
  // options object has the key encoding which defines the encoding type
  // of the data string that has been passed in
  const bufferData = Buffer.from(data, options.encoding || 'ascii');
  const unixFs = new Unixfs('file', bufferData);

  let result = await DAGNode.create(unixFs.marshal(), (err, dagNode) => {
    if (err) return console.error(err);
    return dagNode.toJSON().multihash;
  });
  return result;
};

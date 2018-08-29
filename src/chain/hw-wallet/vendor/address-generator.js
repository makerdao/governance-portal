/* eslint-disable */
import ethUtil from 'ethereumjs-util';
import HDKey from 'hdkey';

export default class AddressGenerator {
  constructor(data) {
    console.log('data', data);
    this.hdk = new HDKey();
    this.hdk.publicKey = new Buffer(data.publicKey, 'hex');
    this.hdk.chainCode = new Buffer(data.chainCode, 'hex');
    console.log('data.publicKey', data.publicKey);
    console.log('data.chainCode', data.chainCode);
  }

  getAddressString = index => {
    console.log('m/${index}', `m/${index}`);
    let derivedKey = this.hdk.derive(`m/${index}`);
    console.log('derivedKey', derivedKey);
    console.log('derivedKey.publicKey', derivedKey.publicKey);
    let address = ethUtil.publicToAddress(derivedKey.publicKey, true);
    let addressString = '0x' + address.toString('hex');
    return addressString;
  };
}

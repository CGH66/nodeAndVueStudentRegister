const crypto=require('crypto');
module.exports={
  md5:function (str) {
    let hash=crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  }
}

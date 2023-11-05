const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const compareHash = async (password, hash) => bcrypt.compare(password, hash);

module.exports = { hashPassword, compareHash };

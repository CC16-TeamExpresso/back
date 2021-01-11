require("dotenv").config()
const crypto = require("crypto");

const key = process.env.CRYPTO_KEY;

export const encrypto = (password: string) => {
  const cipher = crypto.createCipher('aes192', key);
  cipher.update(password, 'utf8', 'hex');
  const cipheredText = cipher.final('hex');
  return cipheredText;
}
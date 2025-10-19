import { encrypt, decrypt } from "crypto-js/aes";
import UTF8 from "crypto-js/enc-utf8";
import md5 from "crypto-js/md5";

// 加密key, 值建议从接口获取
const secretKey = "__aioverg__";

// 加密
export function encryption(data: object, secret: string = secretKey) {
  const code = JSON.stringify(data);
  return encrypt(code, secret).toString();
}

// 解密
export function decryption(data: string, secret: string = secretKey) {
  const bytes = decrypt(data, secret);
  const originalText = bytes.toString(UTF8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

// md5加密
export function encryptMd5(data: string) {
  return md5(data).toString();
}

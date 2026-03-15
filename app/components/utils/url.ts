import Hashids from "hashids";

const hashids = new Hashids("your-secret-salt", 8);

export function encodeId(num: number) {
  return hashids.encode(num);
}

export function decodeId(str: string) {
  const decoded = hashids.decode(str);
  if (!decoded || decoded.length === 0) return null;
  return decoded[0];
}

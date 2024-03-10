import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export const hash = async (password: string, salt: string): Promise<string> => {
  const hash: Buffer = (await scrypt(password, salt, 32)) as Buffer;
  const result: string = salt + '.' + hash.toString('hex');

  return result;
}
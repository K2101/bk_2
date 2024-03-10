import { sign as _sign } from 'jsonwebtoken';
import { credentials } from 'src/config/credential';
import { promisify } from 'util';

const jwtSign = promisify(_sign);

export const sign = async (userId: string, email: string): Promise<string> => {
  const expired = 86400000 * 3;
  const jwt: string = await jwtSign(
    {
      exp: Date.now() + expired,
      data: { userId, email },
    },
    credentials.jwtSecret,
  );
  return jwt;
}


export const jwtExtract = (request: Request): string => {
  const jwt: string = request.headers['authorization']?.split(' ')[1];
  return jwt
} 
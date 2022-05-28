import { TokenType } from '../API/API';
import jwt_decode from 'jwt-decode';

export function getToken(cookieName: string, cookies: string) {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export function decodeToken(token: string) {
  const { userId, login, iat }: TokenType = jwt_decode(token);
  return { userId, login, iat };
}
export function createTokenCookie(token: string) {
  const expires = new Date(Date.now() + 86400 * 1000).toUTCString();
  document.cookie = `token=${token}; expires=${expires}; secure`;
}

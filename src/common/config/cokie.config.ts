import { CookieOptions } from 'express';

const oneDay = 1 * 24 * 60 * 60 * 1000;

export const cookie = (seconds = oneDay): CookieOptions => {
  const date = new Date();
  date.setTime(date.getTime() + seconds);

  return {
    expires: date,
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
  };
};

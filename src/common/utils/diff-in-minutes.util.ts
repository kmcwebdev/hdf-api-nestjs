import { differenceInMinutes } from 'date-fns';

export function diffInMinutes(dateTime: Date) {
  return differenceInMinutes(dateTime, new Date(Date.now()));
}

import { format } from 'date-fns';

export function currentDate() {
  const date = `${format(new Date(Date.now()), 'yyyy-MM-dd')}T00:00:00.000Z`;

  return new Date(date);
}

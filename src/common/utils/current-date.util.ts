import { format } from 'date-fns';

export function currentDate() {
  const date = `${format(new Date(), 'yyyy-MM-dd')}T00:00:00.000Z`;

  return new Date(date);
}

export function testCurrentDate() {
  const today = new Date();
  const tomorrow = new Date();

  return new Date(tomorrow.setDate(today.getDate() + 1));
}

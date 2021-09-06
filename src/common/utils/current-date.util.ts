import { format } from 'date-fns';

export function currentDate() {
  return new Date(format(new Date(Date.now()), 'yyyy-dd-mm'));
}

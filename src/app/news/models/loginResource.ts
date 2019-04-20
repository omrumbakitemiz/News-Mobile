import { User } from './user';

export interface LoginResource {
  token: string;
  user: User;
}

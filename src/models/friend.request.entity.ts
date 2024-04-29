import { Entity, ManyToOne } from 'typeorm';
import { CustomBase } from './_custom.base';
import { User } from './user.entity';

@Entity()
export class FriendRequest extends CustomBase {
  @ManyToOne(() => User, (user) => user.friends)
  user: User;

  @ManyToOne(() => User, (user) => user.friendOf)
  friend: User;
}

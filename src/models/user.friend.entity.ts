import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { User } from './user.entity';
import { AccountStatusEnum } from '../modules/user/enums/account.status.enum';
import { CustomBase } from './_custom.base';

@Entity()
export class UserFriend extends CustomBase {
  @ManyToOne(() => User, (user) => user.friends)
  user: User;

  @ManyToOne(() => User, (user) => user.friendOf)
  friend: User;

  @Index()
  @Column({
    type: 'enum',
    enum: AccountStatusEnum,
    default: AccountStatusEnum.ACTIVE,
  })
  accountStatus: AccountStatusEnum;
}

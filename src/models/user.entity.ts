import { CustomBase } from './_custom.base';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { UserFriend } from './user.friend.entity';
import { FriendRequest } from './friend.request.entity';

@Entity()
export class User extends CustomBase {
  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, length: 600 })
  status: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fcm_token: string;

  @Column({ nullable: true })
  avatar: string;

  fullName: string;
  public avatarUrl: string;
  public user_friends?: User[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.user)
  friends: UserFriend[];

  @OneToMany(() => UserFriend, (userFriend) => userFriend.friend)
  friendOf: UserFriend[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.user)
  Requests: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.friend)
  requestsReceived: FriendRequest[];

  @Column({ type: 'timestamp', default: null })
  status_updated_at: Date;

  @AfterLoad()
  afterLoadMethod() {
    this.fullName =
      this.firstName && this.lastName
        ? this.firstName + ' ' + this.lastName
        : '';
    this.avatarUrl = this.avatar
      ? `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET_NAME}/o/${this.avatar}?alt=media`
      : `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET_NAME}/o/${process.env.FIREBASE_STORAGE_DEFAULT_PROFILES_PATH}?alt=media`;
  }
}

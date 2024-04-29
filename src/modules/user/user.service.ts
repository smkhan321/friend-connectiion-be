import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UserFriend } from '../../models/user.friend.entity';
import { MemoryStoredFile } from 'nestjs-form-data';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { RequestContext } from 'nestjs-request-context';
import { NotificationTypeEnum } from '../../enums/notification.type.enum';
import { FirebaseNotificationService } from '../firebase/firebase.notification.service';
import { AccountStatusEnum } from './enums/account.status.enum';
import { LoginUserDto } from './dto/login.user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFriend)
    private readonly userFriendRepository: Repository<UserFriend>,
    private readonly notificationService: FirebaseNotificationService,
  ) {}
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User not found against id: ${id}`);
    }
    return user;
  }
  async getAllUsers() {
    const { user_friends, id } = await this.getLoggedInUser();
    const userNotIncluded = user_friends.map((friend) => {
      return friend.id;
    });
    userNotIncluded.push(id);
    const { Requests, requestsReceived } = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: [
        'Requests',
        'Requests.friend',
        'requestsReceived',
        'requestsReceived.user',
      ],
    });
    const users = await this.userRepository.find({
      where: {
        id: Not(In(userNotIncluded)),
      },
    });
    return users.map((usr) => {
      if (Requests.some((e) => e.friend.id === usr.id)) {
        usr['request_sent'] = true;
      }
      if (requestsReceived.some((e) => e.user.id === usr.id)) {
        usr['request_receive'] = true;
      }
      return usr;
    });
  }
  async signIn(userData: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException(`Not Allowed`);
    }
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        fcm_token: userData.fcm_token,
      },
    );
    return {
      uuid: user.id,
    };
  }
  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const userCreated = await this.userRepository
        .create({ status_updated_at: null, ...user })
        .save();
      if (user.image) {
        await this.uploadProfile(user.image, userCreated);
      }
      return await this.findById(userCreated.id);
    } catch (e) {
      console.error(e);
      if (e?.code === 'ER_DUP_ENTRY')
        throw new BadRequestException('User Already found');
      throw new BadRequestException(e.message);
    }
  }
  async getLoggedInUser(): Promise<User> {
    const req: any = RequestContext.currentContext.req;
    const uuid = req.headers['api-key'];
    const existingUser = await this.userRepository.findOne({
      where: {
        id: uuid,
      },
      relations: ['friends', 'friends.friend', 'friendOf', 'friendOf.user'],
    });
    if (!existingUser) {
      throw new HttpException('No User found', 404);
    }
    existingUser['user_friends'] = [
      ...existingUser.friends.map((record) => {
        record['friend']['user_status'] = record.accountStatus;
        return record.friend;
      }),
      ...existingUser.friendOf.map((record) => {
        record['user']['user_status'] = record.accountStatus;
        return record.user;
      }),
    ];
    return existingUser;
  }
  async uploadProfile(file: MemoryStoredFile, user: User): Promise<User> {
    user.avatar = await this.firebaseService.upload({
      from: FirebaseService.UPLOAD_TYPES.PROFILE,
      id: user.id,
      file: file,
      currentPath: null,
    });
    await this.userRepository.save(user);
    return this.findById(user.id);
  }
  async updateUser(user: UpdateUserDto) {
    const loggedInUser = await this.getLoggedInUser();
    await this.userRepository.update(
      {
        id: loggedInUser.id,
      },
      user,
    );
    if (user.image) {
      await this.uploadProfile(user.image, loggedInUser);
    }
    return await this.findById(loggedInUser.id);
  }
  async updateStatus(status: string) {
    const loggedInUser = await this.getLoggedInUser();
    await this.userRepository.update(
      {
        id: loggedInUser.id,
      },
      {
        status: status,
        status_updated_at: new Date(),
      },
    );
    const { user_friends } = loggedInUser;
    const userFriendsFCM = user_friends.map((record) => {
      return record.fcm_token;
    });
    await this.sendStatusNotificationToUsers(loggedInUser, userFriendsFCM);
    return await this.findById(loggedInUser.id);
  }
  async getUserFeed() {
    const user = await this.getLoggedInUser();
    const { friends, friendOf } = user;
    const userFriends = [...friends, ...friendOf].filter((record) => {
      if (record.accountStatus === AccountStatusEnum.ACTIVE) return true;
    });
    const friendUids = userFriends.map((friend) => {
      return friend.friend.id;
    });
    return await this.userRepository.find({
      where: {
        id: In(friendUids),
        status_updated_at: Not(IsNull()),
      },
      select: ['firstName', 'lastName', 'email', 'status_updated_at', 'status'],
      order: {
        status_updated_at: 'DESC',
      },
    });
  }
  async sendStatusNotificationToUsers(user: User, friendsFcms: string[]) {
    await this.notificationService.sendNotification(friendsFcms, {
      title: 'User status updated',
      type: NotificationTypeEnum.STATUS_NOTIFICATION,
      body: `Status updated by ${user.firstName} ${user.lastName} on profile!`,
    });
  }
}

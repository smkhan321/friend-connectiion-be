import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/user.entity';
import { Repository } from 'typeorm';
import { FriendRequest } from '../../models/friend.request.entity';
import { UserFriend } from '../../models/user.friend.entity';
import { AccountStatusEnum } from '../user/enums/account.status.enum';

@Injectable()
export class FriendService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequest: Repository<FriendRequest>,
    @InjectRepository(UserFriend)
    private readonly userFriend: Repository<UserFriend>,
  ) {}
  async sendRequest(userId: string) {
    const user = await this.userService.getLoggedInUser();
    const friend = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!friend) {
      throw new BadRequestException('friend not found');
    }
    const requestAlreadySent = await this.friendRequest.findOne({
      where: {
        user: {
          id: user.id,
        },
        friend: {
          id: friend.id,
        },
      },
    });
    if (requestAlreadySent) {
      throw new BadRequestException('Request Already Sent');
    }
    const friendRequest = new FriendRequest();
    friendRequest.user = user;
    friendRequest.friend = friend;

    return this.friendRequest.save(friendRequest);
  }

  async acceptRequest(id: string) {
    const user = await this.userService.getLoggedInUser();
    const request = await this.friendRequest.findOne({
      where: {
        id: id,
        friend: {
          id: user.id,
        },
      },
      relations: ['user', 'friend'],
    });
    if (!request) {
      throw new BadRequestException('Request not found');
    }
    const userFriend = new UserFriend();
    userFriend.user = request.user;
    userFriend.friend = request.friend;
    userFriend.accountStatus = AccountStatusEnum.ACTIVE;

    const friends = await this.userFriend.save(userFriend);
    if (friends) {
      await this.friendRequest.delete({
        id: request.id,
      });
    }
    return friends;
  }

  async getAllRequests() {
    const loggedInUser = await this.userService.getLoggedInUser();
    const { Requests, requestsReceived } = await this.userRepository.findOne({
      where: {
        id: loggedInUser.id,
      },
      relations: [
        'Requests',
        'Requests.user',
        'Requests.friend',
        'requestsReceived',
        'requestsReceived.user',
        'requestsReceived.friend',
      ],
    });
    return { Requests, requestsReceived };
  }

  async deleteRequest(id: string) {
    const user = await this.userService.getLoggedInUser();
    const { affected } = await this.friendRequest.delete({
      id: id,
      user: {
        id: user.id,
      },
    });
    return affected >= 1;
  }

  async rejectRequest(id: string) {
    const user = await this.userService.getLoggedInUser();
    const { affected } = await this.friendRequest.delete({
      id: id,
      friend: {
        id: user.id,
      },
    });
    return affected >= 1;
  }

  async blockFriend(friendID: string) {
    const user = await this.userService.getLoggedInUser();
    const friendRecord = await this.userFriend.findOne({
      where: {
        user: {
          id: user.id,
        },
        friend: {
          id: friendID,
        },
      },
    });
    const friendOfRecord = await this.userFriend.findOne({
      where: {
        user: {
          id: friendID,
        },
        friend: {
          id: user.id,
        },
      },
    });
    if (!friendRecord && !friendOfRecord) {
      throw new BadRequestException('friend not found');
    }
    if (friendRecord) {
      return await this.userFriend.update(
        { id: friendRecord.id },
        {
          accountStatus: AccountStatusEnum.BLOCKED,
        },
      );
    }
    if (friendOfRecord) {
      return await this.userFriend.update(
        { id: friendOfRecord.id },
        {
          accountStatus: AccountStatusEnum.BLOCKED,
        },
      );
    }
  }
}

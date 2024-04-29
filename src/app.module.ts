import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from '../ormconfig';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './modules/user/user.service';
import { User } from './models/user.entity';
import { UserFriend } from './models/user.friend.entity';
import { FriendRequest } from './models/friend.request.entity';
import { UserController } from './modules/user/user.controller';
import { FirebaseService } from './modules/firebase/firebase.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FriendService } from './modules/friend/friend.service';
import { FriendController } from './modules/friend/friend.controller';
import { RequestContextModule } from 'nestjs-request-context';
import { FirebaseNotificationService } from './modules/firebase/firebase.notification.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestjsFormDataModule,
    RequestContextModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return connectionSource.options;
      },
    }),
    TypeOrmModule.forFeature([User, UserFriend, FriendRequest]),
  ],
  controllers: [AppController, UserController, FriendController],
  providers: [
    AppService,
    UserService,
    FirebaseService,
    FriendService,
    FirebaseNotificationService,
  ],
})
export class AppModule {}

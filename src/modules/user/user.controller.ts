import { Body, Controller, Get, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { ResponseDto } from '../../dto/response.dto';
import { User } from '../../models/user.entity';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateUserDto } from './dto/update.user.dto';
import { UpdateStatusDto } from './dto/update.status.dto';
import { Public } from '../../decorators/public.decorator';
import { LoginUserDto } from './dto/login.user.dto';

@ApiTags('User')
@ApiSecurity('access-key')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('all')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return new ResponseDto(HttpStatus.OK, 'Users', users);
  }

  @Public()
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ limits: { files: 1 } })
  async createUser(@Body() user: CreateUserDto): Promise<ResponseDto<User>> {
    const newUser = await this.userService.createUser(user);
    return new ResponseDto<User>(HttpStatus.OK, 'User', newUser);
  }

  @Get()
  async getLoggedInUser(): Promise<ResponseDto<User>> {
    const user = await this.userService.getLoggedInUser();
    return new ResponseDto<User>(HttpStatus.OK, 'User', user);
  }

  @Post()
  @Public()
  async getFirebaseTokenByEmailAndPassword(
    @Body() user: LoginUserDto,
  ): Promise<ResponseDto<{ uuid: string }>> {
    return new ResponseDto<{ uuid: string }>(
      HttpStatus.OK,
      'User token!',
      await this.userService.signIn(user),
    );
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ limits: { files: 1 } })
  async updateUser(@Body() user: UpdateUserDto) {
    return new ResponseDto(
      HttpStatus.OK,
      'User Updated',
      await this.userService.updateUser(user),
    );
  }

  @Put('/status')
  async updateUserPreferences(@Body() data: UpdateStatusDto) {
    return new ResponseDto(
      HttpStatus.OK,
      'Status updated successfully!',
      await this.userService.updateStatus(data.status),
    );
  }

  @Get('/feed')
  async getUserFeed() {
    return new ResponseDto(
      HttpStatus.OK,
      'User Feed!',
      await this.userService.getUserFeed(),
    );
  }
}

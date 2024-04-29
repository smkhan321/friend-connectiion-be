import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ResponseDto } from '../../dto/response.dto';
import { FriendService } from './friend.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FriendRequest } from '../../models/friend.request.entity';

@ApiTags('Friends')
@ApiSecurity('access-key')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get('request/all')
  async getAllRequest() {
    const users = await this.friendService.getAllRequests();
    return new ResponseDto(HttpStatus.OK, 'Requests', users);
  }

  @Post('request/:userid')
  async postRequestByUserId(
    @Param('userid') id: string,
  ): Promise<ResponseDto<FriendRequest>> {
    const request = await this.friendService.sendRequest(id);
    return new ResponseDto<FriendRequest>(
      HttpStatus.OK,
      'Request sent',
      request,
    );
  }

  @Get('request/:id/accept')
  async acceptRequestByUserId(
    @Param('id') id: string,
  ): Promise<ResponseDto<FriendRequest>> {
    const request = await this.friendService.acceptRequest(id);
    return new ResponseDto<FriendRequest>(
      HttpStatus.OK,
      'Accept Request',
      request,
    );
  }

  @Delete('request/:id')
  async deleteRequestByUserId(
    @Param('id') id: string,
  ): Promise<ResponseDto<any>> {
    const request = await this.friendService.deleteRequest(id);
    return new ResponseDto<any>(HttpStatus.OK, 'Delete Request', request);
  }
  @Delete('request/:id/reject')
  async rejectRequestByUserId(
    @Param('id') id: string,
  ): Promise<ResponseDto<any>> {
    const request = await this.friendService.rejectRequest(id);
    return new ResponseDto<any>(HttpStatus.OK, 'Reject Request', request);
  }
  @Post(':id/block')
  async BlockUserById(@Param('id') id: string): Promise<ResponseDto<any>> {
    const request = await this.friendService.blockFriend(id);
    return new ResponseDto<any>(HttpStatus.OK, 'Block Friend', request);
  }
}

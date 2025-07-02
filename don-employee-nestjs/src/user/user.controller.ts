import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateProfileDto } from 'src/dtos/update-profile.dto';
import { UpdatePasswordDto } from 'src/dtos/update-password.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('me/:id')
  getProfile(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('me')
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    console.log('req ===> ', req);
    console.log('dto ===> ', dto);
    return this.userService.update(req.body.id, dto);
  }

  @Patch('me/password')
  async changePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    const user = await this.userService.findOne(req.body.id);
    console.log('user ===> ', user);
    const isMatch = await bcrypt.compare(dto.oldPassword, user!.password);
    if (!isMatch) throw new UnauthorizedException('Password lama salah');

    return this.userService.update(req.body.id, {
      password: dto.newPassword,
    });
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateUserDto>) {
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

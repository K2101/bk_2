import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto } from './dto/user-dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/user')
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<boolean> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('/user/login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto
  ): Promise<string> {
    return await this.userService.login(loginDto)
  }
}

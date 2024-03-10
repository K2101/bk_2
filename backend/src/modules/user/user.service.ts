import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user-entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto } from './dto/user-dto';
import { randomBytes } from 'crypto';
import { hash } from 'src/utils/hash';
import { sign } from 'src/utils/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const { email, password, reTypePassword } = createUserDto;

    if (password !== reTypePassword) {
      throw new BadRequestException("difference confirm password provided")
    }

    const emailLowerCase = email.toLowerCase();
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = await hash(password, salt);

    try {

      const user = this.userEntity.create({
        email: emailLowerCase,
        password: hashedPassword

      });
      await this.userEntity.save(user);
    } catch (err) {
      // can be any error;
      throw new BadRequestException("this user already exist")
    }
    return true;
  }


  async login(login: LoginDto): Promise<string> {
    const { email, password } = login;

    const emailLowerCase = email.toLowerCase();
    const user = await this.userEntity.findOne({ where: { email: emailLowerCase } });

    if (!user) {
      throw new BadRequestException("invalid credentials")
    }

    const [salt, _storeHash] = user.password.split('.');
    const hashedPassword = await hash(password, salt);


    if (hashedPassword !== user.password) {
      throw new BadRequestException("invalid credentials")
    }

    const jwt = await sign(user.id.toString(), user.email);

    return JSON.stringify({ message: jwt })
  }
}

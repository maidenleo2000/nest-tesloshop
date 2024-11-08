import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard()) //Esta linea valida que el usuario tenga que estar logueado para poder ver la ruta
  testingPrivateRoute(
    // @GetUser(['email', 'role', 'fullName']) user: User,
    @GetUser() user: User,
    @Req() request: Express.Request

  ){

    // console.log({user: request.user})
    console.log({user})
    return{
      ok: true,
      message: 'Hola mundo private',
      user: user
    }
  }

  
}

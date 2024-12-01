import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


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
    @GetUser('email') userEmail: string,
    @Req() request: Express.Request,

    @RawHeaders() rawHeaders: string[],

  ){

    console.log(request);
    // console.log({user: request.user})
    console.log({user})
    return{
      ok: true,
      message: 'Hola mundo private',
      user: user,
      userEmail: userEmail,
      rawHeaders: rawHeaders,
    }
  }

  @Get('private2')
  //Forma fea
  // @SetMetadata('roles', ['admin', 'super-user'])

  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)

  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){

    return{
      ok: true,
      user
    }

  }

  @Get('private3')
  //Forma fea
  // @SetMetadata('roles', ['admin', 'super-user'])

  //TODO se reemplazan estos 2 decoradores por @Auth
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard)

  //Aca se valida que el usuario TENGA el rol que pongo entre parentesis, sino no pasa. Para proteger la ruta para cualquier usuario va vacio y valida la ruta para cualquiera, debe tener el token actual
  @Auth(ValidRoles.admin)

  privateRoute3(
    @GetUser() user: User
  ){

    return{
      ok: true,
      user
    }

  }

  
}

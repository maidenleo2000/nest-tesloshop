import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}


 async create(createUserDto: CreateUserDto) {
    // return 'This action adds a new user';

    try {

      const { password, ...userData } = createUserDto
      
      const user = this.userRepository.create( {
        ...userData,
        //encriptar clave
        password: bcrypt.hashSync(password, 10)
      } );
      await this.userRepository.save(user);
      delete user.password;

      // return user;

      return {
        ...user,
        // token: this.getJwtToken({email: user.email})
        token: this.getJwtToken({id: user.id})
      }

      //TODO retornar JWT de acceso

    } catch (error) {
      // console.log(error)
      this.handleDBErrors(error)
    }

  }





  async login(loginUserDto: LoginUserDto) {
    
    const { email, password } = loginUserDto;

    //para devolver solamente la informacion que quiero
    const user = await this.userRepository.findOne({ 
      // where: {email},
      where: {email},
      select:{ email: true, password: true, id: true }
     });

     if(!user){
      throw new UnauthorizedException('Credentials are not valid (email)')
     }

     //Para comparar las claves
     if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Credentials are not valid (password)');
     }
    // return user
    //TODO retornar el JWT de acceso

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }

  }



  async checkAuthStatus(user: User){
    
    return{
      ...user,
      token: this.getJwtToken({id: user.id})
    }

  }



  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;


  }



  private handleDBErrors(error: any): never{
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
      console.log(error)
    }else{
      throw new InternalServerErrorException('Please check server logs')
    }
  }

  
}

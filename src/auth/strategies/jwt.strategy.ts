import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ){


        super({

            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        })
    }
    

    async validate(payload: JwtPayload): Promise<User> {  
        // const {email} = payload;

        //Cambio la linea 31 para que en vez del email pueda usar el id
        const {id} = payload;

        //validaciones personalizadas

        //tengo que ir a la tabla y buscar un usuario por el email anterior
        // const user = await this.userRepository.findOneBy({email});
        const user = await this.userRepository.findOneBy({id});

        if(!user) throw new UnauthorizedException('Token not valid')

        if (!user.isActive) throw new UnauthorizedException('User is inactive, talk with an admin')

        return user;


    }


}
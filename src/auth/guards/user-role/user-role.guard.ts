import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(
    //Reflector me ayuda a ver informacion de decoradores y otra informacion de la metadata del mismo metodo donde este puesto
    private readonly reflector: Reflector
  ) {
  }


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // const validRoles: string[] = this.reflector.get('roles', context.getHandler());
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    //TODO context y ctx es lo mismo pero el segundo se usa mas
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;


    if(!user) throw new BadRequestException('User not found');

    console.log({userRoles: user.roles})

    // console.log('UserRoleGuard');
    // console.log({ validRoles });

    for (const role of user.roles) {
      if(validRoles.includes(role)) {
        return true;
      }
    }
    
    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`
    );
  }
}

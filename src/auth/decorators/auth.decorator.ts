

import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(

    //En esta seccion el @ no va adelante de los decoradores, se llaman como metodo
    RoleProtected(...roles),


    UseGuards(AuthGuard(), UserRoleGuard),
    
  );
}

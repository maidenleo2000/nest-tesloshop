import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { authenticate } from 'passport';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
//TODO Colocando aca el @Auth solo ven los productos quienes esten autenticados
// @Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  //! Para crear tiene que ser usuario o admin para la prueba
  // @Auth(ValidRoles.admin)
  @Auth()
  //COMANDO DE SWAGGER
  @ApiResponse({ status: 201, description: 'Product was created', type: Product }) 
  @ApiResponse({ status: 400, description: 'Bad request', type: Product }) 
  @ApiResponse({ status: 403, description: 'Forbidden. Token not provided', type: Product }) 
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    // console.log(paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  //!Para actualizar tiene que ser admin
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  //!Para eliminar tiene que ser admin
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}

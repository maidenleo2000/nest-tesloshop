// import { PartialType } from '@nestjs/mapped-types'; //Hace opcionales los atributos y se heredan de CreateProductDTO
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

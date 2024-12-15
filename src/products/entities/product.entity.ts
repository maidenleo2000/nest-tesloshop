//Entity es una clase que representa una tabla en la base de datos

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product title',
        uniqueItems: true
    })
    //Con los decoradores @Column se define una columna en la base de datos
    @Column('text', { unique: true }) //el unique en true es para que no hayan 2 productos con el mismo nombre
    title: string;

    @ApiProperty({
        example: '0.00',
        description: 'Product price',
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
        description: 'Product description',
        uniqueItems: null
    })
    //Nullable es para que sea opcional
    @Column('text', { nullable: true })
    description: string;

    @ApiProperty({
        example: 't-shirt-teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;
    

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', { default: 0 })
    stock: number;


    @ApiProperty({
        example: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],    
        description: 'Product sizes',        
    })
    @Column('text', { array: true })
    sizes: string[];

    @ApiProperty({
        example: ['men', 'women', 'kid', 'unisex'],
        description: 'Product gender',
    })
    @Column('text')
    gender: string;


    @ApiProperty()
    @Column('text', { array: true, default: [] })
    tags: string[];

    @ApiProperty()
    //images
    //Esta es la relacion entre Product y ProductImage. Un producto puede tener muchas imagenes
    @OneToMany(
        () => ProductImage, //va a regresar un ProductImage
        (productImage) => productImage.product,

        //Eager es para que se carguen las imagenes y cascade es para que se actualicen automaticamente
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    //TODO Configurando relacion
    @ManyToOne( 
        () => User,
        (user) => user.product,
        { eager: true } //para que cargue la relacion en las consultas
    )
    user: User



    //Esto valida que venga el slug y sino crea uno a partir del titulo. Luego lo pasa a minusculas y reemplaza los espacios por _.
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


    @BeforeUpdate()
    checkSlugUpdate(){
        if(!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
    

}


import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  
  @Inject()
  private readonly productService: ProductsService

  @InjectRepository(User)
  private readonly userRepository: Repository<User>

  async runSeed(){
    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED'
  }


  //TODO Con esto borro todos los productos y despues todos los usuarios
  private async deleteTables(){
    
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute(
      // {force: true}
    )

  }


  private async insertUsers(){

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {
      users.push(this.userRepository.create(user))
    });

    const dbUsers =  await this.userRepository.save(seedUsers);

    return dbUsers[0];

  }


  private async insertNewProducts(user: User){
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      // this.productService.create(product);
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }

}

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {}

  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(id: string) {
    // throw 'A random error';
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      //throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
   const coffee = this.coffeeRepository.create(createCoffeeDto); // create coffee class instance based on dto and save it to coffee variable
   return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({ // create new entity based on object passed to it, checks if the entity already exists in db and retrieves it; updates it if found; returns undefined if not found
      id: +id,
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee); // save changes to db
  }

  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOne(id); // find one handles error automatically if not found
    return this.coffeeRepository.remove(coffee);
  }

}

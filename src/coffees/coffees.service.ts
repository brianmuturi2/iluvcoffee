import { HttpException, HttpStatus, Injectable, NotFoundException, Query } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const {limit, offset} = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit
    });
  }

  async findOne(id: string) {
    // throw 'A random error';
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors']
    });
    if (!coffee) {
      //throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    // create flavor entities if non existing
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
    );
    // create coffee & flavor entities
   const coffee = this.coffeeRepository.create({ ...createCoffeeDto, flavors }); // create coffee class instance based on dto and save it to coffee variable, override flavor with new instance
   return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = updateCoffeeDto.flavors && (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))));
    const coffee = await this.coffeeRepository.preload({ // create new entity based on object passed to it, checks if the entity already exists in db and retrieves it; updates it if found; returns undefined if not found
      id: +id,
      ...updateCoffeeDto,
      flavors
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

  // Take flavor name as string and return flavor entity if it exists, return it else create it
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({name});
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({name});
  }

}

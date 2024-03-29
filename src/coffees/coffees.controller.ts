import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res, SetMetadata,
  UsePipes, ValidationPipe
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { Protocol } from '../common/decorators/protocol.decorator';

@UsePipes(ValidationPipe)
@Controller('coffees')
export class CoffeesController {

  constructor(private readonly coffeeService: CoffeesService) {
  }

  @Public()
  @UsePipes(ValidationPipe)
  @Get()
  findAll(@Protocol() protocol: string, @Query() paginationQuery: PaginationQueryDto) {
    // const {limit, offset} = paginationQuery;
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param() params) {
    return this.coffeeService.findOne(params.id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log('check type ', createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}

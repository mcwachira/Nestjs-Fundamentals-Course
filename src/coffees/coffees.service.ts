import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";

@Injectable()
export class CoffeesService {
constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
    
) {
}

  async findAll() {
    return await this.coffeeRepository.find();
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOneBy({id: id,});
    if (!coffee) {
      throw new HttpException(
        `Coffee with ${id}  not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return  await this.coffeeRepository.save(coffee);
  }


  async update(id:string, updateCoffeeDto: UpdateCoffeeDto) {
  //preloads creates a new entity based on the object passed into it. check to see if entity exist and if so retrieves it
  const coffee = await this.coffeeRepository.preload({
    id: +id,
    ...updateCoffeeDto,
  })

    if(!coffee){
      throw new NotFoundException(`Coffee # ${id} not found`)
    }
    return this.coffeeRepository.save(coffee)
  }


  async remove(id: number) {
    const coffee = await this.findOne(id);

    return this.coffeeRepository.remove(coffee);
  }
}

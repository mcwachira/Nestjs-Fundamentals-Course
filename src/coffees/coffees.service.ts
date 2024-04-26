import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto } from "./dto/create-coffee.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {Flavor} from "./entities/flavor.entity";

@Injectable()
export class CoffeesService {
constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,


  @InjectRepository(Flavor)
  private readonly flavorRepository: Repository<Flavor>
    
) {
}

  async findAll() {
    return await this.coffeeRepository.find({
          relations: ['flavors']
        }
    );
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where:{id:id},
      relations: ['flavors']

    } )
    if (!coffee) {
      throw new HttpException(
        `Coffee with ${id}  not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee
  }

  async create(createCoffeeDto: CreateCoffeeDto) {

  const flavors = await Promise.all(createCoffeeDto.flavors.map((name) => this.preloadFlavourByName(name)))


    const coffee = this.coffeeRepository.create({...createCoffeeDto, flavors});
    return  await this.coffeeRepository.save(coffee);
  }


  async update(id:string, updateCoffeeDto: UpdateCoffeeDto) {
  //check if the flavours exist as its optional
    const flavors =updateCoffeeDto.flavors && (await Promise.all( updateCoffeeDto.flavors.map((name) => this.preloadFlavourByName(name))
    ));

  //preloads creates a new entity based on the object passed into it. check to see if entity exist and if so retrieves it
  const coffee = await this.coffeeRepository.preload({
    id: +id,
    ...updateCoffeeDto,
    flavors
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


  private async preloadFlavourByName(name: string): Promise<Flavor>{

  const existingFlavor = await this.flavorRepository.findOne({where: {name}});
  if(existingFlavor) {
    return existingFlavor;
  }

  return this.flavorRepository.create({name})
  }
}

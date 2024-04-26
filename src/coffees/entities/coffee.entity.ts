import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity() //each entity class isd a sql table sql table === 'coffee
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('json', {nullable: true}) // makes the values optional and stored the values as json
   flavors: string[];
}

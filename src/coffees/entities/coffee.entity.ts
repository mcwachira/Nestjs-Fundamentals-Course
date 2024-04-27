import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Flavor} from "./flavor.entity";

@Entity() //each entity class isd a sql table sql table === 'coffee
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({default:0})
 recommendations: number;

  //@Column('json', {nullable: true}) // makes the values optional and stored the values as json
  @JoinTable()
  @ManyToMany( type => Flavor, flavor => flavor.coffees,
      {
        cascade: true, // flavours will be added automatically when the coffee is created
      },
)
  flavors: Flavor[];
}

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({default: 0})
  recommendations: number;

  @JoinTable() // helps specify the owner side of the relationship
  @ManyToMany(
    type => Flavor,
    (flavor) => flavor.coffees,
    {
      cascade: true // ['insert']
    }) // first arg is fn that returns a reference to the related entity; second arg is fn that returns the related entity and specify what property needs to be selected that is the inverse side of the relationship i.e what is owner/ parent inside child
  flavors: Flavor[];
}

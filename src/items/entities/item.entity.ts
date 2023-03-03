import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "items" })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;
  @Column()
  @Field(() => String)
  name: string;

 /* @Column()
  @Field(() => Float)
  quantity: number;*/

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;

  @ManyToOne( () => User, (user) => user.items)
  @Field(() => User)
  user: User;

}

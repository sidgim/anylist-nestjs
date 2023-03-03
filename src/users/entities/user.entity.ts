import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, ObjectType } from "@nestjs/graphql";

@Entity({ name: "users" })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
//@Field( () => String)
  password: string;

  @Column({ type: "text", array: true, default: ["user"] })
  @Field(() => [String])
  roles: string[];

  @Column({ type: "boolean", default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: "lastUpdateBy" })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
}
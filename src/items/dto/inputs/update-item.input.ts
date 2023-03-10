import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateItemInput } from './create-item.input';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @IsUUID()
  @Field(() => ID)
  @IsString()
  id: string;
}

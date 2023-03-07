import { CreateListInput } from './create-list.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => ID)
  @IsString()
  @IsUUID()
  id: string;
}

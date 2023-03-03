import { Item } from "./entities/item.entity";
import { ItemsResolver } from "./items.resolver";
import { ItemsService } from "./items.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [
    TypeOrmModule.forFeature([Item])
  ]
})
export class ItemsModule {
}

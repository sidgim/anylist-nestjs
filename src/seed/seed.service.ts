import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
    private readonly listItemService: ListItemService,
    private readonly listService: ListsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }
    await this.deleteDatabase();

    const user = await this.loadUsers();

    await this.loadItems(user);

    const list = await this.loadLists(user);

    const items = await this.itemService.findAll(
      user,
      { limit: 15, offset: 0 },
      {},
    );

    await this.loadListItems(list, items);
    return true;
  }

  async deleteDatabase() {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemService.create(item, user));
    }
    await Promise.all(itemsPromises);
  }

  async loadLists(user: User): Promise<List> {
    const lists = [];
    for (const list of SEED_LISTS) {
      lists.push(await this.listService.create(list, user));
    }
    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<ListItem> {
    const listsItem = [];
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 10),
        done: false,
        listId: list.id,
        itemId: item.id,
      });
    }
    return listsItem[0];
  }
}

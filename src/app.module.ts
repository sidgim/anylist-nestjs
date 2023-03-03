import { ApolloDriver } from "@nestjs/apollo";

import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core/dist/plugin";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ItemsModule } from "./items/items.module";
import { JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { join } from "path";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), "src/schema.gql"),
        plugins: [ApolloServerPluginLandingPageLocalDefault],
        context({ req }) {
          const token = req.headers.authorization?.replace("Bearer ", "");
          if (!token) throw Error("Token needed");

          const payload = jwtService.decode(token);
          if (!payload) throw Error("Token not valid");
        }
      })
    }),
    /*  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    playground: false,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    plugins: [
      ApolloServerPluginLandingPageLocalDefault
    ]
  }), */
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true
    }),
    ItemsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
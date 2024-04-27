import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [CoffeesModule, TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'newPassword',
    database:'postgres',
    autoLoadEntities:true,
    synchronize:true, //lets type orm generate a sql table automatically dev only

  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-solitary-cell-a1ze6et7-pooler.ap-southeast-1.aws.neon.tech',
      port: 5432,
      username: 'neondb_owner',
      password: 'npg_SfuQL0VIjwz8',
      database: 'neondb',
      ssl: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

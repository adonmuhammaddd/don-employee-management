import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'employee_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // untuk dev only
    }),
    EmployeeModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { Leave } from 'src/entities/leave.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leave, Employee])],
  controllers: [LeaveController],
  providers: [LeaveService],
})
export class LeaveModule {}

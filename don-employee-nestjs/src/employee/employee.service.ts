import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private repo: Repository<Employee>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.repo.find();
  }

  create(dto: CreateEmployeeDto): Promise<Employee> {
    const newEmp = this.repo.create(dto);
    return this.repo.save(newEmp);
  }

  async update(id: number, data: Partial<CreateEmployeeDto>) {
    await this.repo.update(id, data);
    return this.repo.findOneBy({ id });
  }
}

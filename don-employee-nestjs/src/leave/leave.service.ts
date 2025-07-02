import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Leave } from 'src/entities/leave.entity';
import { CreateLeaveDto } from 'src/dtos/create-leave.dto';
import { Employee } from 'src/entities/employee.entity';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave) private leaveRepo: Repository<Leave>,
    @InjectRepository(Employee) private empRepo: Repository<Employee>,
  ) {}

  async create(data: CreateLeaveDto) {
    const { employeeId, reason, startDate, endDate } = data;
    const employee = await this.empRepo.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new BadRequestException('Karyawan tidak ditemukan');
    const leaves = await this.leaveRepo.find({
      where: { employeeId: employeeId },
    });

    const newLeaveDays = this.countDays(startDate, endDate);
    const year = new Date(startDate).getFullYear();
    const month = new Date(startDate).getMonth();

    const leavesThisYear = leaves.filter(
      (l) => new Date(l.startDate).getFullYear() === year,
    );

    const totalLeaveDays = leavesThisYear.reduce(
      (sum, l) => sum + this.countDays(l.startDate, l.endDate),
      0,
    );
    if (totalLeaveDays + newLeaveDays > 12) {
      throw new BadRequestException('Maksimal cuti 12 hari per tahun');
    }

    const alreadyLeaveThisMonth = leavesThisYear.find(
      (l) => new Date(l.startDate).getMonth() === month,
    );
    if (alreadyLeaveThisMonth) {
      throw new BadRequestException('Sudah mengambil cuti di bulan ini');
    }

    const leave = this.leaveRepo.create({
      employeeId,
      reason,
      startDate,
      endDate,
    });
    return this.leaveRepo.save(leave);
  }

  async findAll() {
    const leaves = await this.leaveRepo.find();
    const empIds = this.extractField(leaves, 'employeeId');
    const emps = await this.empRepo.find({
      where: { id: In(empIds) },
    });
    console.log('EMPS =======> ', emps);
    const result = this.mergeMatchedValues(leaves, emps, 'employeeId', 'id', [
      'firstName',
      'lastName',
    ]);
    return result;
  }

  async update(id: number, data: Partial<CreateLeaveDto>) {
    await this.leaveRepo.update(id, data);
    return this.leaveRepo.findOneBy({ id });
  }

  async remove(id: number) {
    return this.leaveRepo.delete(id);
  }

  private countDays(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  private extractField<T, K extends keyof T>(items: T[], key: K): T[K][] {
    return items.map((item) => item[key]);
  }

  private mergeMatchedValues<
    T extends Record<string, any>,
    U extends Record<string, any>,
    K1 extends keyof T,
    K2 extends keyof U,
    KExtract extends keyof U,
  >(
    array1: T[],
    array2: U[],
    key1: K1,
    key2: K2,
    fieldsToCopy: KExtract[],
  ): (T & Pick<U, KExtract>)[] {
    return array1.map((item1) => {
      const match = array2.find(
        (item2) => item1[key1] === (item2[key2] as unknown as T[K1]),
      );
      if (match) {
        const extracted = Object.fromEntries(
          fieldsToCopy.map((field) => [field, match[field]]),
        ) as Pick<U, KExtract>;
        return { ...item1, ...extracted };
      }
      return { ...item1 } as T & Pick<U, KExtract>;
    });
  }
}

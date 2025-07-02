import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  reason: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;
}

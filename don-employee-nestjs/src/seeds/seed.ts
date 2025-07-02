import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmployeeService } from '../employee/employee.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeeService = app.get(EmployeeService);
  const userService = app.get(UserService);

  const employees: CreateEmployeeDto[] = [
    {
      firstName: 'Budi',
      lastName: 'Santoso',
      email: 'budi.santoso@example.com',
      phone: '081234567890',
      address: 'Jakarta Selatan',
      gender: 'Laki-laki',
    },
    {
      firstName: 'Siti',
      lastName: 'Nurhaliza',
      email: 'siti.nurhaliza@example.com',
      phone: '081234567891',
      address: 'Bandung',
      gender: 'Perempuan',
    },
    {
      firstName: 'Andi',
      lastName: 'Wijaya',
      email: 'andi.wijaya@example.com',
      phone: '081234567892',
      address: 'Surabaya',
      gender: 'Laki-laki',
    },
    {
      firstName: 'Dewi',
      lastName: 'Lestari',
      email: 'dewi.lestari@example.com',
      phone: '081234567893',
      address: 'Yogyakarta',
      gender: 'Perempuan',
    },
    {
      firstName: 'Rizki',
      lastName: 'Hidayat',
      email: 'rizki.hidayat@example.com',
      phone: '081234567894',
      address: 'Bekasi',
      gender: 'Laki-laki',
    },
    {
      firstName: 'Nina',
      lastName: 'Kurnia',
      email: 'nina.kurnia@example.com',
      phone: '081234567895',
      address: 'Depok',
      gender: 'Perempuan',
    },
    {
      firstName: 'Agus',
      lastName: 'Pratama',
      email: 'agus.pratama@example.com',
      phone: '081234567896',
      address: 'Tangerang',
      gender: 'Laki-laki',
    },
    {
      firstName: 'Lina',
      lastName: 'Sari',
      email: 'lina.sari@example.com',
      phone: '081234567897',
      address: 'Semarang',
      gender: 'Perempuan',
    },
    {
      firstName: 'Yusuf',
      lastName: 'Maulana',
      email: 'yusuf.maulana@example.com',
      phone: '081234567898',
      address: 'Bogor',
      gender: 'Laki-laki',
    },
    {
      firstName: 'Indah',
      lastName: 'Permata',
      email: 'indah.permata@example.com',
      phone: '081234567899',
      address: 'Malang',
      gender: 'Perempuan',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const suPass = await bcrypt.hash('admin123', 10);
  const adminPass = await bcrypt.hash('admin', 10);
  const users: CreateUserDto[] = [
    {
      firstName: 'Don',
      lastName: 'Muhammad',
      email: 'don.dev.exe@gmail.com',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: suPass,
      birthDate: '1996-02-06',
      gender: 'Laki-laki',
      role: 'Super Admin',
    },
    {
      firstName: 'Joko',
      lastName: 'Joko',
      email: 'joko@mail.com',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: adminPass,
      birthDate: '1986-06-16',
      gender: 'Laki-laki',
      role: 'Admin',
    },
  ];

  for (const emp of employees) {
    await employeeService.create(emp);
  }
  for (const usr of users) {
    await userService.create(usr);
  }

  console.log('✅ Seeding completed!');
  await app.close();
}

bootstrap();

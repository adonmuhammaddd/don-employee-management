import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { EmployeeService } from '../employee/employee.service';
import { CreateEmployeeDto } from '../employee/create-employee.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employeeService = app.get(EmployeeService);

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

  for (const emp of employees) {
    await employeeService.create(emp);
  }

  console.log('✅ Seeding completed!');
  await app.close();
}

bootstrap();

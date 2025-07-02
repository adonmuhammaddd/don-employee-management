export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  password: string;
  role: 'User' | 'Admin' | 'Super Admin';
}

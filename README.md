
# Employee Management

Manage employee and their leave status



## Features

- CRUD Employee
- CRUD Leave
- User Profile Edit


## Tech Stack

**Client:** 
- NextJS: **15.3.4**
- TailwindCSS

**Server:** 
- NestJS: **11.0.1**

**CLI:** 
- NestJS: **11.0.1**
- Node: **22.11.0**
- NPM: **10.9.0**


## Installation

Clone this root project

### Front End

Execute from root project folder
```bash
  cd don-employee-nextjs
  npm install
  npm run dev
```
### Database
Create database `employee_db`
```bash
  CREATE DATABASE IF NOT EXISTS `employee_db`
```
### Back End
Execute from root project folder
```bash
  cd don-employee-nestjs
  npm install
  npm run seed
  npm run start:dev
```

### Login Super Admin

```bash
  email : don.dev.exe@gmail.com
  password : admin123
```
### Login Admin

```bash
  email : joko@mail.com
  password : admin
```


## API Reference

#### Get all employees
```http
  GET /employees
```
#### Add new employee
```http
  POST /employees
```
#### Edit employee
```http
  PATCH /employees/:id
```
| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `id`       | `number` | **Required**. Id of item to fetch |
| `firstName`| `string` | **Required**. First Name of item to fetch |
| `lastName` | `string` | **Required**. Last Name of item to fetch |
| `phone`    | `string` | **Required**. Phone of item to fetch |
| `gender`   | `string` | **Required**. Gender of item to fetch |
| `address`   | `string` | **Required**. Address of item to fetch |

#### Delete employee
```http
  DELETE /employees/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of item to fetch |

#### Get user profile data
```http
  GET /users/me/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of item to fetch |

#### Edit user profile
```http
  PATCH /users/me/:id
```
| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `id`       | `number` | **Required**. Id of item to fetch |
| `firstName`| `string` | **Required**. First Name of item to fetch |
| `lastName` | `string` | **Required**. Last Name of item to fetch |
| `phone`    | `string` | **Required**. Phone of item to fetch |
| `gender`   | `string` | **Required**. Gender of item to fetch |

#### Change password user profile
```http
  PATCH /users/password
```
| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `id`       | `number` | **Required**. Id of item to fetch |
| `oldPassword`| `string` | **Required**. Old Password of item to fetch |
| `newPassword` | `string` | **Required**. New Password of item to fetch |

#### Get all leaves
```http
  GET /leaves
```
#### Add new leave
```http
  POST /leaves
```
| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `reason`| `string` | **Required**. Reason of item to fetch |
| `startDate` | `string` | **Required**. Start Date of item to fetch |
| `endDate`    | `string` | **Required**. End Date of item to fetch |
| `employeeId`   | `number` | **Required**. Employee ID of item to fetch |

#### Edit leave
```http
  PATCH /leave/:id
```
| Parameter  | Type     | Description                       |
| :--------  | :------- | :-------------------------------- |
| `id`       | `number` | **Required**. Id of item to fetch |
| `reason`| `string` | **Required**. Reason of item to fetch |
| `startDate` | `string` | **Required**. Start Date of item to fetch |
| `endDate`    | `string` | **Required**. End Date of item to fetch |
| `employeeId`   | `number` | **Required**. Employee ID of item to fetch |

#### Delete leave
```http
  DELETE /leave/:id
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `number` | **Required**. Id of item to fetch |

import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
class AddressDto {
  @IsString()
  city?: string;

  @IsString()
  country?: string;

  @IsString()
  postalCode?: string;
}
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  constructor(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    phoneNumber: string,
    address: {
      city: string;
      country: string;
      postalCode: string;
    },
  ) {
    this.email = email;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}

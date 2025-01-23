interface IUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;
}

export class User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;

  constructor(user: IUser) {
    this.email = user.email;
    this.password = user.password;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phoneNumber = user.phoneNumber;
    this.address = user.address;
  }
}

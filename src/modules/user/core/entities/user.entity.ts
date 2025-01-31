export interface UserProps {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: {
    city: string;
    country: string;
    postalCode: string;
  };
  isEmailVerified: boolean;
  isActive: boolean;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get firstname(): string {
    return this.props.firstname;
  }

  get lastname(): string {
    return this.props.lastname;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get address(): UserProps['address'] {
    return this.props.address;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
}

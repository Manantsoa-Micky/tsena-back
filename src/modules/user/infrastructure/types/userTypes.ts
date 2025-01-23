import { Document } from 'mongoose';
type TUser = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;
};
interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  address: string;
}

export { TUser, IUser };

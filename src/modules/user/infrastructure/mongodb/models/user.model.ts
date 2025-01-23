import mongoose, { Schema } from 'mongoose';
import { IUser } from '../../types/userTypes';

const userSchema: Schema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const UserModel = mongoose.model<IUser>('User', userSchema);
export { UserModel, IUser };

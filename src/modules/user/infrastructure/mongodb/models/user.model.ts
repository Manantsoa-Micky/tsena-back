import mongoose, { Schema } from 'mongoose';
import { User } from '@user/core/entities/user.entity';

const userSchema: Schema = new Schema<User>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: {
    city: { type: String, required: false },
    country: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
  isEmailVerified: { type: Boolean, required: false },
  isActive: { type: Boolean, required: false },
});

const UserModel = mongoose.model<User>('User', userSchema);
export { UserModel, User };

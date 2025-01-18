import bcrypt from 'bcryptjs';

const encrypt = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

const isPasswordValid = async (password: string, userPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, userPassword);
};

export { encrypt, isPasswordValid };
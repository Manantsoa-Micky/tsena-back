import * as bcrypt from 'bcryptjs';
import { HashInterface } from '@auth/application/interfaces/cryptography/hash.interface';

export class BcryptAdapter implements HashInterface {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}

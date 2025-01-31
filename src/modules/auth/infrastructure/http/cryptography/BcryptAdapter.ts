import { HashComparer } from '@auth/application/interfaces/cryptography/HashComparer';
import { HashGenerator } from '@auth/application/interfaces/cryptography/HashGenerator';
import * as bcrypt from 'bcryptjs';

export class BcryptAdapter implements HashGenerator, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}

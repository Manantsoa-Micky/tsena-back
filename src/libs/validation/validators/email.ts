import { Validation } from '../interface/validation.interface';

export class EmailValidator implements Validation {
  constructor(readonly field: string) {}

  validate(input: any): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input[this.field]);
  }
}

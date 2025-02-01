export interface HashInterface {
  hash(data: string): Promise<string> | string;

  compare(plaintext: string, hash: string): Promise<boolean> | boolean;
}

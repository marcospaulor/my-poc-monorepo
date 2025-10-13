export interface IdProvider {
  generate(): string;
  isValid(id: string): boolean;
}

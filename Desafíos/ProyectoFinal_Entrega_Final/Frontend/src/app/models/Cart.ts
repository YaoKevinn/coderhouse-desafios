import { Product } from "./Product";

export interface Cart {
  id: number,
  timestamp: string,
  productos: Product[],
}

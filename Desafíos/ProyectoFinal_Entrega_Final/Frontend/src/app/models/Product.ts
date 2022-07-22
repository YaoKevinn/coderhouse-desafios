export interface Product {
  id: string,
  timestamp: string,
  nombre: string,
  description: string,
  codigo: string,
  foto: string,
  precio: number,
  stock: number,
  quantity?: number,
}

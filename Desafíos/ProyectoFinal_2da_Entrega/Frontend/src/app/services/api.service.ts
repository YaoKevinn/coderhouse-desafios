
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { share } from 'rxjs/operators';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBaseUrl: string = "http://localhost:8080/api/";

  constructor(public http: HttpClient) {}

  getAllProducts() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')

    return this.http.get<any>(this.apiBaseUrl + 'productos', { headers }).pipe(share());
  }

  addNewProduct(name: string, description: string, codigo: string, foto: string, precio: number, stock: number) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')

    return this.http.post<any>(this.apiBaseUrl + 'productos', {
      nombre: name,
      description,
      codigo,
      foto,
      precio,
      stock,
    }, { headers }).pipe(share());
  }

  removeProduct(id: number) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')

    return this.http.delete<any>(this.apiBaseUrl + `productos/${id}`, { headers }).pipe(share());
  }

  modifyProduct(id: number, name: string, description: string, codigo: string, foto: string, precio: number, stock: number) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')

    return this.http.put<any>(this.apiBaseUrl + `productos/${id}`, {
      nombre: name,
      description,
      codigo,
      foto,
      precio,
      stock,
    }, { headers }).pipe(share());
  }

  // a. POST: '/' - Crea un carrito y devuelve su id.
  // b. DELETE: '/:id' - Vac a un carrito y lo elimina.
  // c. GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito
  // d. POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto
  // e. DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de
  // producto

  createCart(products: Product[]) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')

    return this.http.post<any>(this.apiBaseUrl + 'carrito', { products }, { headers }).pipe(share());
  }

  getProductsByCartId(cartId: number) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')

    return this.http.get<any>(this.apiBaseUrl + `carrito/${cartId}/productos`, { headers }).pipe(share());
  }

  addProductsToCart(cartId: number, products: Product[]) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')

    return this.http.post<any>(this.apiBaseUrl + `carrito/${cartId}/productos`, { products }, { headers }).pipe(share());
  }

  removeCartById(cartId: number) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')

    return this.http.delete<any>(this.apiBaseUrl + `carrito/${cartId}`, { headers }).pipe(share());
  }

  removeProductInCartById(cartId: number, productId: number) {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')

    return this.http.delete<any>(this.apiBaseUrl + `carrito/${cartId}/productos/${productId}`, { headers }).pipe(share());
  }
}

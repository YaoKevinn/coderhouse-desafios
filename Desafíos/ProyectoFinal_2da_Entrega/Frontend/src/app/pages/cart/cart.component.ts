import { Product } from 'src/app/models/Product';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddCartDialogComponent } from 'src/app/components/add-cart-dialog/add-cart-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartIdControl: FormControl = new FormControl('', [Validators.required]);
  idToShow: any = undefined;
  productsInCart: Product[] = [];
  productsNotInCart: Product[] = [];
  allProducts: Product[] = [];

  isNewCart: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.apiService.getAllProducts().subscribe((products) => {
      this.allProducts = products;
    });
  }

  searchBtnClicked(isNewCart: boolean = false) {
    this.apiService.getProductsByCartId(this.cartIdControl.value).subscribe((response) => {
      this.productsInCart = response.productos;
      this.idToShow = this.cartIdControl.value;
      const idsInCart = this.productsInCart.map((p) => p.id);
      this.productsNotInCart = this.allProducts.filter((p) => !idsInCart.includes(p.id));
      this.isNewCart = isNewCart;
    });
  }

  removeProductFromCart(product: Product) {
      this.apiService.removeProductInCartById(this.idToShow, product.id).subscribe(() => {
        this.productsInCart = this.productsInCart.filter((p) => p.id !== product.id);
        this.productsNotInCart.push(product);
      });
  }

  addProductToCart(product: Product) {
    const products = [];
    products.push(product)
    this.apiService.addProductsToCart(this.idToShow, products).subscribe((response) => {
        this.productsNotInCart = this.productsNotInCart.filter((p) => p.id !== product.id);
        this.productsInCart.push(product);
    });
  }

  openNewCartDialog() {
    this.dialog.open(AddCartDialogComponent).afterClosed().subscribe((newId) => {
      if (newId) {
        this.cartIdControl.setValue(newId);
        this.searchBtnClicked(true);
      }
    });
  }


}

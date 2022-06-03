import { EditDialogComponent } from './../../components/edit-dialog/edit-dialog.component';
import { ConfirmDialogComponent } from './../../components/confirm-dialog/confirm-dialog.component';
import { AddProductDialogComponent } from './../../components/add-product-dialog/add-product-dialog.component';

import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.apiService.getAllProducts().subscribe((products) => {
       this.allProducts = products;
    }, (err) => {
      console.log(err);
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
    });
  }

  openAddProductDialog() {
    this.dialog.open(AddProductDialogComponent).afterClosed().subscribe((newProduct) => {
      this.allProducts.push(newProduct);
    });
  }

  removeProduct(product: Product) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { product: product }
    }).afterClosed().subscribe((remove) => {
      if (remove) {
        this.apiService.removeProduct(product.id).subscribe(() => {
          this.allProducts = this.allProducts.filter((p) => p.id !== product.id);
        });
      }
    });
  }

  modifyProduct(product: Product) {
    this.dialog.open(EditDialogComponent, {
      data: { product: product }
    }).afterClosed().subscribe((newProduct) => {
      if (newProduct) {
        const index = this.allProducts.findIndex((p) => p.id === product.id);
        this.allProducts[index] = newProduct;
      }
    });
  }

}

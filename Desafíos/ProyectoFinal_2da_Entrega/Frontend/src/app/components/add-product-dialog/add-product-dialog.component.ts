
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent implements OnInit {
  nameControl: FormControl = new FormControl('', [Validators.required]);
  descriptionControl: FormControl = new FormControl('', [Validators.required]);
  codeControl: FormControl = new FormControl('', [Validators.required]);
  priceControl: FormControl = new FormControl('', [Validators.required]);
  stockControl: FormControl = new FormControl('', [Validators.required]);
  photoControl: FormControl = new FormControl('', [Validators.required]);


  constructor(private apiService: ApiService, private dialogRef: MatDialogRef<AddProductDialogComponent>) { }

  ngOnInit(): void {
  }

  addProduct() {
    this.apiService.addNewProduct(
      this.nameControl.value,
      this.descriptionControl.value,
      this.codeControl.value,
      this.photoControl.value,
      +this.priceControl.value,
      +this.stockControl.value
    ).subscribe((product) => {
      console.log(product);
      this.dialogRef.close(product);
    });
  }

}

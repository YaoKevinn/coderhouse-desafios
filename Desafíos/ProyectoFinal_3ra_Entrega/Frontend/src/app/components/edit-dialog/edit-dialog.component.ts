import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  nameControl: FormControl = new FormControl('', [Validators.required]);
  descriptionControl: FormControl = new FormControl('', [Validators.required]);
  codeControl: FormControl = new FormControl('', [Validators.required]);
  priceControl: FormControl = new FormControl('', [Validators.required]);
  stockControl: FormControl = new FormControl('', [Validators.required]);
  photoControl: FormControl = new FormControl('', [Validators.required]);


  constructor(private apiService: ApiService, private dialogRef: MatDialogRef<EditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.nameControl.setValue(this.data.product.nombre);
    this.descriptionControl.setValue(this.data.product.description);
    this.codeControl.setValue(this.data.product.codigo);
    this.priceControl.setValue(this.data.product.precio);
    this.stockControl.setValue(this.data.product.stock);
    this.photoControl.setValue(this.data.product.foto);
  }

  modifyProduct() {
    this.apiService.modifyProduct(
      this.data.product.id,
      this.nameControl.value,
      this.descriptionControl.value,
      this.codeControl.value,
      this.photoControl.value,
      +this.priceControl.value,
      +this.stockControl.value,
    ).subscribe(() => {
      console.log('Product modificado!');
      this.dialogRef.close({
        nombre: this.nameControl.value,
        description: this.descriptionControl.value,
        codigo: this.codeControl.value,
        foto: this.photoControl.value,
        precio: +this.priceControl.value,
        stock: +this.stockControl.value,
      });
    })
  }

}

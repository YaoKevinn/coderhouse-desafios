import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-cart-dialog',
  templateUrl: './add-cart-dialog.component.html',
  styleUrls: ['./add-cart-dialog.component.scss']
})
export class AddCartDialogComponent implements OnInit {

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddCartDialogComponent>) { }

  ngOnInit(): void {
  }

  addCart() {
    this.apiService.createCart([]).subscribe((response) => {
      this.dialogRef.close(response.newCartId);
    });
  }

}

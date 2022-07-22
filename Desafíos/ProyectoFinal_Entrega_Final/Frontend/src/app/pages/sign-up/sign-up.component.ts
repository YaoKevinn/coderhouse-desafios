
import { UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  mailControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  passwordControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  nameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  addressControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  yearControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
  phoneControl: UntypedFormControl = new UntypedFormControl('', [Validators.required]);

  fileBase64: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
  }

  signUp() {
    this.apiService.signUp(
      this.mailControl.value,
      this.passwordControl.value,
      this.nameControl.value,
      this.addressControl.value,
      this.yearControl.value,
      this.phoneControl.value,
      this.fileBase64
    ).subscribe((res) => {
      console.log(res);
      console.log('Register success');
      this.router.navigate(['login']);
    });
  }

  handleUpload(event: any) {
    const files = event.target.files;
    if (files.length !== 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (onloadEvent: any) => {
        this.fileBase64 = onloadEvent.target.result;
        console.log(this.fileBase64);
      };
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }


}

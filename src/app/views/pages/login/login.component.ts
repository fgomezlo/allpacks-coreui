import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, 
  ColComponent, CardGroupComponent, TextColorDirective, 
  CardComponent, CardBodyComponent, FormDirective, 
  InputGroupComponent, InputGroupTextDirective, 
  FormControlDirective, ButtonDirective, FormModule } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, 
      ColComponent, CardGroupComponent, TextColorDirective, 
      CardComponent, CardBodyComponent, FormDirective, 
      InputGroupComponent, InputGroupTextDirective, 
      IconDirective, FormControlDirective, ButtonDirective, 
      NgStyle, FormModule, ReactiveFormsModule, CommonModule]
})
export class LoginComponent implements OnInit{
  
  simpleForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];

  constructor(
    private router : Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { 
    
    this.createForm();
  }
  ngOnInit(): void {
    
  }

  onSubmit() {
    
    if (!this.onValidate()) { 
      return ;
    }

    this.authService.auth(
      this.simpleForm.get("email")?.value,
      this.simpleForm.get("clave")?.value
    ).then((response:any)=>{
      
      console.log(response);
      localStorage.setItem(environment.jwtoken, response.token);

      this.router.navigate(["/dashboard"]);
      //this.simpleForm.reset();

    }).catch((errorres)=>{
      Swal.fire('Ups !!!', `${errorres.error.msg} - (Code ${errorres.error.error})`, 'error');
    });

  }

  get email() {
    return this.simpleForm.controls["email"];
  }

  get clave() {
    return this.simpleForm.controls["clave"];
  }

  createForm() {
    this.simpleForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        clave: ["", [Validators.required]],
      }
    );
    this.formControls = Object.keys(this.simpleForm.controls);
  }

  onValidate() {
    this.submitted = true;
    // stop here if form is invalid
    return this.simpleForm.status === "VALID";
  }

}

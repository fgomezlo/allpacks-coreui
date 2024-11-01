import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, 
  ColComponent, CardGroupComponent, TextColorDirective, 
  CardComponent, CardBodyComponent, FormDirective, 
  InputGroupComponent, InputGroupTextDirective, 
  FormControlDirective, ButtonDirective, FormModule, 
  ModalComponent, ImgModule,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  ModalToggleDirective,
  ButtonCloseDirective} from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaSettings, RecaptchaModule } from 'ng-recaptcha-2';


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
      NgStyle, FormModule, ReactiveFormsModule, CommonModule,
      ModalComponent, ModalHeaderComponent, ModalBodyComponent,
      ModalFooterComponent, ModalToggleDirective, ButtonCloseDirective,
      ImgModule, RecaptchaFormsModule, RecaptchaModule
    ],
    providers: [
      {
        provide: RECAPTCHA_SETTINGS,
        useValue: {
          siteKey: environment.recaptcha.siteKey,
        } as RecaptchaSettings,
      },
    ],
})
export class LoginComponent implements OnInit{
  
  simpleForm!: FormGroup;
  simpleFormRecovery!: FormGroup;
  submitted = false;
  submittedRecovery = false;
  formErrors: any;
  formErrorsRecovery: any;
  formControls!: string[];
  formControlsRecovery!: string[];

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
    
    if (!this.onValidate(this.simpleForm, "signin")) { 
      return ;
    }

    this.authService.auth(
      this.simpleForm.get("email")?.value,
      this.simpleForm.get("clave")?.value,
      this.simpleForm.get("recaptcha")?.value
    ).then((response:any)=>{
      
      // console.log(response);
      localStorage.setItem(environment.jwtoken, response.token);

      this.router.navigate(["/dashboard"]);
      //this.simpleForm.reset();

    }).catch((errorres)=>{
      Swal.fire('Ups !!!', `${errorres.error.msg} - (Code ${errorres.error.error})`, 'error');
    });

  }
  
  onSubmitRecovery() {
    
    console.log("call onSubmitRecovery", this.simpleFormRecovery);
    if (!this.onValidate(this.simpleFormRecovery, "recovery")) { 
      return ;
    }

    this.authService.recovery(
      this.simpleFormRecovery.get("forgotemail")?.value,
      this.simpleFormRecovery.get("recaptcha")?.value
    ).then((response:any)=>{

      Swal.fire("Solicitud registrada", "Correo de recuperación enviado exitosamente<br />Por favor revise su correo y siga las instrucciones" ,'success');

    }).catch((errorres)=>{
      Swal.fire('Solicitud no procesada', `${errorres.error.msg} - (Code ${errorres.error.error})`, 'error');
    });

  }

  get forgotemail() {
    return this.simpleFormRecovery.controls["forgotemail"];
  }
  
  get recaptchaRecovery() {
    return this.simpleFormRecovery.controls["recaptcha"];
  }
  
  get recaptcha() {
    return this.simpleForm.controls["recaptcha"];
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
        email: ["", [Validators.required]],
        clave: ["", [Validators.required]],
        recaptcha : ["", Validators.required]
      }
    );
    this.formControls = Object.keys(this.simpleForm.controls);

    this.simpleFormRecovery = this.formBuilder.group(
      {
        forgotemail: ["", [Validators.required, Validators.email]],
        recaptcha : ["", Validators.required]
      }
    );
    
  }

  onValidate(form : FormGroup, formSubmited : string) {
    
    if(formSubmited == "recovery")
      this.submittedRecovery = true;
    else
      this.submitted = true;

    // stop here if form is invalid
    return form.status === "VALID";
  }

  recaptchaForgot(captchaResponse: string | null) {
    
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.recaptchaRecovery.setValue(captchaResponse == null ? "" : captchaResponse);

  }
  
  recaptchaSignin(captchaResponse: string | null) {
    
    this.recaptcha.setValue(captchaResponse == null ? "" : captchaResponse);

  }
}

import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule, CardModule, ColComponent, ContainerComponent, FormModule, ImgModule, RowComponent } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha-2';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { samePasswords } from "./passrecovery.validators";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passrecovery',
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent,
    CardModule, FormModule, ReactiveFormsModule, CommonModule,
    ImgModule, RecaptchaFormsModule, RecaptchaModule, IconModule,
    ButtonModule, RouterLink
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],

  templateUrl: './passrecovery.component.html',
  styleUrl: './passrecovery.component.scss'
})
export class PassrecoveryComponent implements OnInit{
  
  simpleForm!: FormGroup;
  userupdate! : any;
  submitted : boolean = false;
  currentuser : any;
  currenttoken : string | null = null;
  tokendisabled : string | null = null;

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    //console.log("Passtoken: " + this.route.snapshot.paramMap.get("passtoken"));
    this.createForm();
    this.currenttoken = this.route.snapshot.paramMap.get("passtoken");
    this.authService
    .checkTokenReset(this.currenttoken)
    .then((response : any ) =>{
      this.currentuser = response.data
    })
    .catch((errores) =>{
      //console.log(error);
      this.tokendisabled =errores. error.msg;
    });
    
  }

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private formBuilder: FormBuilder,
    private authService: AuthService) {
  }

  createForm() {

    this.simpleForm = this.formBuilder.group(
      {
        clave: ["", [Validators.required]],
        claveConfirmar: ["", [Validators.required]],
        recaptcha : ["", [Validators.required]]
      },
      {
        validators : [
          samePasswords()
        ]
      }
    );
  }

  onSubmit() {

    this.submitted = true;

    if(this.simpleForm.status !== "VALID") {
      return;
    }

    this.authService.resetPass(
      this.currenttoken,
      this.simpleForm.value.recaptcha,
      this.simpleForm.value.clave
    ).then((res)=>{
      Swal.fire(
        "Nueva clave registrada",
        "Su nueva clave ha sido registrada exitosamente",
        "success"
      ).then(()=>{
        this.router.navigate(["/login"]);
      })
    })
  }
 
  recaptchaRestore(captchaResponse: string | null) {
    this.recaptcha.setValue(captchaResponse == null ? "" : captchaResponse);
  }

  get recaptcha() {
    return this.simpleForm.controls["recaptcha"];
  }

  get clave() {
    return this.simpleForm.controls["clave"];
  }
  
  get claveconfirmar() {
    return this.simpleForm.controls["claveConfirmar"];
  }
}

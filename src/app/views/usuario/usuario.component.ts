import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BadgeModule,
  ButtonModule,
  CardModule,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormModule,
  ImgModule,
  ModalModule,
  PaginationModule,
  RowComponent,
  TabDirective,
  TableModule,
  TabPanelComponent,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import _ from 'lodash';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha-2';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardModule,
    FormModule,
    ReactiveFormsModule,
    CommonModule,
    ImgModule,
    IconModule,
    ButtonModule,
    RouterLink,
    TableModule,
    BadgeModule,
    PaginationModule,
    ModalModule,
    TabsComponent,
    TabPanelComponent,
    TabsContentComponent,
    TabsListComponent,
    TabDirective
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent implements OnInit {
  simpleForm!: FormGroup;
  userForm!: FormGroup;
  data: any;
  pagination: any = {
    totalitems: 0,
    pages: [],
    limit: 10,
    currentoffset: 0,
  };
  params: any[any] | null = [];
  updateuser: any = null;
  rollist : any[] = [];
  rolesSelected : any[] = [];

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.simpleForm = this.formBuilder.group({
      filtervalue: [''],
    });

    this.createUserForm();

    // listen queryparams changes
    this.router.queryParams.subscribe((param) => {
      if (param['offset']) {
        this.params['offset'] = param['offset'];
      }

      this.refreshData(this.params);
    });
  }

  refreshData(params: any) {
    this.userService
      .search(params)
      .then((response) => {
        this.data = response;
        //console.log(this.data)
        this.pagination.limit = this.data.limit;
        this.calcPagination(this.data.totalitems, this.data.offset);
      })
      .catch((error) => {
        Swal.fire('UPS !!', error.message, 'error');
        this.data = null;
        this.pagination.totalitems = 0;
        this.pagination.currentoffset = 0;
        this.pagination.limit = 10;
      });
  }

  calcPagination(totalitems: number, offset: number) {
    let pages = totalitems / this.pagination.limit + 1;
    let currentPage = offset / this.pagination.limit + 1;

    let itempages: any[] = [];
    for (let i = 1; i <= pages; i++) {
      let item = {
        offset: (i - 1) * this.pagination.limit,
        pagenumber: i,
        current: currentPage == i,
      };

      itempages.push(item);
    }

    this.pagination.currentoffset = offset;
    this.pagination.pages = itempages;
  }

  searchFilter() {
    //console.log(this.simpleForm.value);
    this.params = [];
    this.params['filtervalue'] = this.simpleForm.value.filtervalue;
    this.params['offset'] = 0;
    this.refreshData(this.params);
  }

  //MODAL USER
  public visible = false;
  createUserForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      password: [''],
      passwordconfirmed: [''],
      roles: this.formBuilder.array([]),
    });

    // load rol list
    this.userService.rolList()
    .then((roldata : any)=>{
      if(roldata.totalitems > 0) {

        this.rollist = roldata.items;
        this.rollist.map((rolcontrol)=>{
          this.roles.controls.push( this.formBuilder.control(false) );
        })
        return;
      } 
      
      this.rollist = [];
      
    });

  }

  openModal(user: any) {
    this.visible = !this.visible;
    this.updateuser = user;
    let userformvalue = user;
    
    // load data to simpleForm
    if(user != null) {
      this.userForm.patchValue(userformvalue);
      userformvalue = _.omit(user, ["id", "roles"]);
    } else {
      this.userForm.reset();
    }

    // load roles
    this.roles.controls.forEach((fc, index)=>{
      let setval = false;
      if(user != null) {
        setval = this.updateuser && this.updateuser.roles[index] && this.updateuser.roles[index].id == this.rollist[index].id
      }
      fc.setValue(setval);
    });

    // console.log("user selected" , userformvalue);
    // console.log("userformloaded", this.userForm.value);
    
    
  }

  handleModalChange(event: any) {
    this.visible = event;
  }

  // FORM USER VALIDATIONS
  get email() {
    return this.userForm.controls['email'];
  }

  get status() {
    return this.userForm.controls['status'];
  }

  get name() {
    return this.userForm.controls['name'];
  }

  get loguser() {
    return this.userForm.controls['dni'];
  }

  get password() {
    return this.userForm.controls['password'];
  }
  
  get passwordconfirmed() {
    return this.userForm.controls['passwordconfirmed'];
  }

  get roles() {
    return this.userForm.controls["roles"] as FormArray;
  }

  saveuser() {

    let selectedRoles : any[]= [];
    this.roles.controls.forEach((fc, index)=>{
      if(fc.value) {
        selectedRoles.push(this.rollist[index]);
      }
    })
    
    console.log("roles" , selectedRoles);
    console.log("userform", this.userForm.value);

    let sendform : any = this.userForm.value;
    sendform.roles = selectedRoles;
    
    //check if updateduser was selected
    if(this.updateuser) {
      sendform["id"] = this.updateuser.id;
    } else {
      sendform["id"] = 0;
    }

    this.userService
    .save(sendform)
    .then((res:any)=>{
      Swal.fire("Solicitud Procesada", res.message, res.estatus)
      .then(()=>{
        this.searchFilter();
      });
    })
    .catch((error)=>{
      Swal.fire('Solicitud no procesada', error.message, 'error');
    })

  }

  deleteuser(item: any) {
    Swal.fire({
      title: 'Estas seguro de Eliminar el usuario',
      icon: 'warning',
      text: 'El usuario ' + item.name + ' será eliminado de la plaforma',
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: "No"
    })
      .then((res) => {
        
        if (res.isConfirmed) {
          return this.userService.delete(item.id);
        }

        return Promise.reject({code : "none"});
      })
      .then((delresponse: any) => {

        let title = "Solicitud Procesada !";
        if(delresponse.code == "error") {
          title = "Solicitud NO Procesada !";
        }

        Swal.fire(title, delresponse.message, delresponse.code)
        .then(()=>{
          if(delresponse.code != "error")
          this.refreshData(this.params);
        });

      })
      .catch((error) => {

        if(error && error.code && error.code == "none") {
          // force exit
          return;
        }

        Swal.fire('Solicitud no procesada', error.message, 'error');
      });
  }
}

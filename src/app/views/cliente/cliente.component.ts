import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {CustomerService} from '../../services/customer.service';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, ColComponent, FormModule, ModalModule, PaginationModule, RowComponent, TabDirective, TableModule, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CustomPaginationComponent } from 'src/app/components/custom-pagination/custom-pagination.component';
import { ClienteValidators } from './cliente.validators';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    FormModule,
    ReactiveFormsModule,
    TableModule,
    BadgeModule,
    PaginationModule,
    ModalModule,
    TabsComponent,
    TabPanelComponent,
    TabsContentComponent,
    TabsListComponent,
    TabDirective,
    IconModule,
    ButtonModule,
    RouterLink,
    CustomPaginationComponent
  ],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent implements OnInit {

  simpleForm!: FormGroup;
  customerForm!: FormGroup;
  data: any; // pagination data
  params: any[any] | null = []; // for filter object pagination
  
  // combobox options
  listcombos = {
    paises : [],
    estado : [],
    destino : []
  }

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    
    this.simpleForm = this.formBuilder.group({
      filtervalue: [''],
    });
    
    this.createCustomerForm();

    // listen queryparams changes
    this.router.queryParams.subscribe((param) => {
      if (param['offset']) {
        this.params['offset'] = param['offset'];
      }

      this.refreshData(this.params);
    });

  }

  refreshData(params: any) {
    this.customerService
      .search(params)
      .then((response) => {
        this.data = response;
        //console.log(this.data)
      })
      .catch((error) => {
        this.data = null;
        Swal.fire('UPS !!', error.message, 'error');
      });
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
  updatecustomer : any = null;
  createCustomerForm() {
    this.customerForm = this.formBuilder.group({
      name: [''],
      status: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      empresa: [''],
      direccion: [''],
      ciudad: [''],
      estado: [''],
      pais: [''],
      destino: [''],
      telefono: [''],
      notas: [''],
      codigo: [''],
      password: [''],
      passwordconfirmed: ['']
    },{
      validators : [ClienteValidators.matchPasswords]
    });

    // load combo pais list
    this.customerService.paisList()
    .then((paisdata : any)=>{
      
      if(paisdata.totalitems == 0 ) {
        this.listcombos.paises = [];
        return;
      } 
      
      this.listcombos.paises = paisdata.items;
      
    });

    // load combo destino list
    this.customerService.destinoList()
    .then((lstdata : any)=>{
      
      if(lstdata.totalitems == 0 ) {
        this.listcombos.destino = [];
        return;
      } 
      
      this.listcombos.destino = lstdata.items;
      
    });

  }

  openModal(customer: any) {
    this.visible = !this.visible;
    this.updatecustomer = customer;
    let customerformvalue = customer;
    
    // load data to customer form
    if(customer != null) {
      customerformvalue = _.omit(customer, ["id", "password"]);
      this.customerForm.patchValue(customerformvalue);
    } else {
      // new Customer
      this.customerForm.reset(); 
    }

    // console.log("user selected" , userformvalue);
    // console.log("userformloaded", this.userForm.value);
        
  }

  handleModalChange(event: any) {
    this.visible = event;
  }

  // FORM USER VALIDATIONS
  get name() {
    return this.customerForm.controls['name'];
  }

  get status() {
    return this.customerForm.controls['status'];
  }

  get email() {
    return this.customerForm.controls['email'];
  }

  get empresa() {
    return this.customerForm.controls['empresa'];
  }

  get direccion() {
    return this.customerForm.controls['direccion'];
  }

  get ciudad() {
    return this.customerForm.controls['ciudad'];
  }

  get estado() {
    return this.customerForm.controls['estado'];
  }

  get pais() {
    return this.customerForm.controls['pais'];
  }

  get destino() {
    return this.customerForm.controls['destino'];
  }

  get telefono() {
    return this.customerForm.controls['destino'];
  }

  get notas() {
    return this.customerForm.controls['destino'];
  }

  get codigo() {
    return this.customerForm.controls['destino'];
  }

  get password() {
    return this.customerForm.controls['password'];
  }
  
  get passwordconfirmed() {
    return this.customerForm.controls['passwordconfirmed'];
  }

  savecustomer() {
    
    let sendform : any = this.customerForm.value;

    //check if updatedcustomer was selected
    if(this.updatecustomer) {
      sendform["id"] = this.updatecustomer.id;
    } else {
      sendform["id"] = 0;
    }

    this.customerService
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

  deletecustomer(item: any) {
    Swal.fire({
      title: 'Estas seguro de Eliminar el cliente',
      icon: 'warning',
      text: "El cliente '" + item.name + " (" + item.codigo + ")' será eliminado de la plaforma",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: "No"
    })
      .then((res) => {
        
        if (res.isConfirmed) {
          return this.customerService.delete(item.id);
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
  
  comboDes(id: any, lista : any) {
    if(!id) {
      return "ND";
    }

    let obj : any = _.find(lista, { id : id});
    if(!obj) {
      return "NF"
    }

    return obj['des'];
  }

}

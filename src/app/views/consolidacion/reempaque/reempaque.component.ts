import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeModule, ButtonModule, ColComponent, ContainerComponent, FormModule, ModalModule, PaginationModule, RowComponent, TabDirective, TableModule, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import _ from 'lodash';
import { CustomPaginationComponent } from 'src/app/components/custom-pagination/custom-pagination.component';
import { ConsolidacionService } from 'src/app/services/consolidacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reempaque',
  standalone: true,
  imports: [CommonModule,
    RowComponent,
    ColComponent,
    FormModule,
    ReactiveFormsModule,
    TableModule,
    BadgeModule,
    ModalModule,
    TabsComponent,
    TabPanelComponent,
    TabsContentComponent,
    TabsListComponent,
    TabDirective,
    IconModule,
    ButtonModule,
    RouterLink,
    CustomPaginationComponent,
    ContainerComponent],
  templateUrl: './reempaque.component.html',
  styleUrl: './reempaque.component.scss'
})
export class ReempaqueComponent implements OnInit {

  simpleForm!: FormGroup;
  consolidacionForm!: FormGroup;
  data: any; // pagination data
  params: any[any] | null = []; // for filter object pagination
  segmento :string = 'delivery';
  // combobox options
  listcombos = {
    estado : [],
    tiposervicio: [
      {id : "1", des:  'Aereo'},
      {id : "2", des:  'Marítimo'}
    ],
    estatuscolor: [
      {id : "1", color: 'danger'},
      {id : "2", color: 'warning'},
      {id : "3", color: 'success'},
      {id : "4", color: 'light'},
      {id : "5", color: 'primary'}
    ]
  }

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private consolidacionService: ConsolidacionService,
    private route: Router
  ) {}

  ngOnInit(): void {
    //modal status form
    this.consolidacionForm = this.formBuilder.group({
      paquetes : this.formBuilder.array([])
    });

    // pagination form
    this.simpleForm = this.formBuilder.group({
      filtervalue: ['']
    });

    // load combo estados list
    this.consolidacionService.estadoList()
    .then((objdata : any)=>{
      
      if(objdata.totalitems == 0 ) {
        this.listcombos.estado = [];
        return;
      } 
      
      this.listcombos.estado = objdata.items;
    });

    //console.log(this.router.snapshot.url);
    this.segmento = this.router.snapshot.url[0].path
    this.params['title'] = 
      this.router.snapshot.data["title"];

     // listen queryparams changes
     this.router.queryParams.subscribe((param) => {
      if (param['offset']) {
        this.params['offset'] = param['offset'];
        this.refreshData(this.params);
      }

    });
  }

  refreshData(params: any) {
    this.consolidacionService
      .tracking(params)
      .then((response) => {
        this.data = response;
      })
      .catch((error) => {
        Swal.fire('UPS !!', error.message, 'error');
        this.data = null;
      });
  }

  searchFilter() {

    this.params['offset'] = 0;
    this.params = _.merge(this.params,this.simpleForm.value);
    
    this.refreshData(this.params);
    
  }

  showCompleteButton(items : any) : boolean {

    
    if(items.length == 0) return false;

    let missedWarehouse = 0;
    items.map((item: any)=>{
      if(_.isEmpty(_.trim(item.warehouse))) {
        missedWarehouse++;
      }
    });

    return missedWarehouse == 0;
  }


  get paquetes () {
    return this.consolidacionForm.controls["paquetes"] as FormArray;
  }

  // MODAL 
  public visible : any = false;
  currentconsolidacion : any = null;
  totalizar :any = [];

  allCheckedTotalizar(){
    
    let actualChecked = false;
    if(_.isEmpty(this.totalizar)) return;

    actualChecked = this.totalizar[0].checked;

    this.totalizar = this.totalizar.map((item : any) =>{
      item.checked = !actualChecked
      return item;
    })

  }

  changeTotalizarArray(index: number){
    this.totalizar[index].checked = !this.totalizar[index].checked;
  }

  getTotalPackageSelected() {
    
    if(_.isEmpty(this.totalizar)) return 0;

    let total = 0;
    _.filter(this.totalizar,{"checked" : true}).map((item)=>{
      total += item.valor;
    })

    return total;
  }

  openModal(consolidacion: any) {
    
    this.visible = !this.visible;

    this.currentconsolidacion = consolidacion;
    this.paquetes.clear();
    this.totalizar = [];

    // load paquetes 
    this.currentconsolidacion.items.map((paquete : any)=>{
      this.paquetes.push(
        this.formBuilder.group({
          warehouse : [paquete.warehouse],
          nota : [paquete.nota]
        })
      )

      this.totalizar.push({
        id : paquete.id,
        valor : +paquete.valor,
        checked : false
      })
    });

  }

  saveTrackingData() {
    let paquetes = this.consolidacionForm.value.paquetes;
    paquetes = paquetes.map((paquete:any, index:number)=>{
      return {
        id : this.currentconsolidacion.items[index].id,
        nota : paquete.nota,
        warehouse : paquete.warehouse,
      }
    })

    this.consolidacionService.savetracking(
      this.currentconsolidacion.id,
      paquetes
    ).then((res : any)=>{
      Swal.fire("Solicitud Procesada", res.message, res.estatus)
      .then(()=>{
        this.handleModalChange(false);
        this.searchFilter();
      });
    }).catch((error)=>{
      Swal.fire('Solicitud no procesada', error.message, 'error');
    });

  }
  
  handleModalChange(event: any) {
    this.visible = event;
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

  getColorByEstadoId(id: any, lista : any) {
    if(!id) {
      return "";
    }

    let obj : any = _.find(lista, { id : id});
    if(!obj) {
      return ""
    }

    return "table-" + obj['color'];
  }

  deleteConsolidacion(consolidacion: any) {
    
   Swal.fire(
    {
      icon: "warning",
      title: `Deseas eliminar el reempaque '${consolidacion.codigo}' ? `,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }
   ).then(res =>{
    
      if (res.isConfirmed) {
        return this.consolidacionService.delete(consolidacion.id);
      }

      return Promise.reject(null);
    
   }).then((response : any)=>{

    this.searchFilter();

    let title = response.code != "success" ? "UPS !!!" : "Transacción Exitosa"
    Swal.fire(title, response.message, response.code);

   }).catch(error => {

    if(!error) return;

    Swal.fire("Ups !!!", "Hubo un problema con el servidor intente nuevamente", 'error');

   })

  }

  completeConsolidacion(consolidacion: any) {
    
    Swal.fire(
     {
       icon: "warning",
       title: `Deseas cambiar a 'COMPLETADO' el reempaque '${consolidacion.codigo}' ? `,
       showCancelButton: true,
       confirmButtonText: "Sí",
       cancelButtonText: "No"
     }
    ).then(res =>{
     
       if (res.isConfirmed) {
        
         return this.consolidacionService.changestatus(
          consolidacion.id, "3"); // defaultcode for completado
        
       }
 
       return Promise.reject(null);
     
    }).then((response : any)=>{
 
     this.searchFilter();
 
     let title = response.code != "success" ? "UPS !!!" : "Transacción Exitosa"
     Swal.fire(title, response.message, response.code);
 
    }).catch(error => {
 
     if(!error) return;
 
     Swal.fire("Ups !!!", "Hubo un problema con el servidor intente nuevamente", 'error');
 
    })
 
   }
}

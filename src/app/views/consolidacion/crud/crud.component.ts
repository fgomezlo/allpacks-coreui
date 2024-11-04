import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BadgeModule, ButtonModule, ColComponent, ContainerComponent, FormModule, GutterDirective, ModalModule, PaginationModule, RowComponent, TabDirective, TableModule, TabPanelComponent, TabsComponent, TabsContentComponent, TabsListComponent } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import {ConsolidacionService} from '../../../services/consolidacion.service';
import Swal from 'sweetalert2';
import _ from 'lodash';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepicker, NgbDatepickerModule, NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import {CustomPaginationComponent} from '../../../components/custom-pagination/custom-pagination.component'; 

@Component({
  selector: 'app-crud',
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
    NgbInputDatepicker,
    GutterDirective,
    CustomPaginationComponent,
    ContainerComponent
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.scss'
})
export class CrudComponent implements OnInit {
  
  simpleForm!: FormGroup;
  consolidacionForm!: FormGroup;
  changeStatusConsolidacionForm!: FormGroup;
  data: any; // pagination data
  params: any[any] | null = []; // for filter object pagination
  segmento :string = 'consultar'
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

  //datepicker filter
  model : NgbDateStruct | null = null;

  constructor(
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private consolidacionService: ConsolidacionService,
    private route: Router
  ) {}

  ngOnInit(): void {
    
    //modal status form
    this.changeStatusConsolidacionForm = this.formBuilder.group({
      status : ['', Validators.required]
    });

    // pagination form
    this.simpleForm = this.formBuilder.group({
      filtervalue: [''],
      dpFrom: [''],
      dpTo: [''],
      estatusconsolidacion : this.formBuilder.array([])
    });

    // load combo estados list
    this.consolidacionService.estadoList()
    .then((objdata : any)=>{
      
      if(objdata.totalitems == 0 ) {
        this.listcombos.estado = [];
        return;
      } 
      
      this.listcombos.estado = objdata.items;

      this.params["statusconsolidacion"] = [];
      objdata.items.map((status : any)=>{
        //create FormControl inside formArra
        this.estatusconsolidacion.controls.push(
          this.formBuilder.control(false)
        );

        return status;
      })

    });

    //console.log(this.router.snapshot.url);
    this.segmento = this.router.snapshot.url[0].path
    this.params['title'] = 
      this.router.snapshot.data["title"];
    // this is for filter parameter
    this.params["tiposervicio"] =
    this.router.snapshot.data["servicetype"]["id"];

     // listen queryparams changes
     this.router.queryParams.subscribe((param) => {
      if (param['offset']) {
        this.params['offset'] = param['offset'];
      }

      this.refreshData(this.params);
    });

  }

  refreshData(params: any) {
    this.consolidacionService
      .search(params)
      .then((response) => {
        this.data = response;
      })
      .catch((error) => {
        Swal.fire('UPS !!', error.message, 'error');
        this.data = null;
      });
  }

  searchFilter() {
    
    
    // setting range date popup
    this.dpTo.setValue(this.toDate);
    this.dpFrom.setValue(this.fromDate);

    this.params['offset'] = 0;
    
    //load estatusconsolidacion array filter
    let selectedEstatusconsolidacion : any[]= [];
    this.estatusconsolidacion.controls.forEach((fc, index)=>{
      if(fc.value) {
        selectedEstatusconsolidacion.push(this.listcombos.estado[index]);
      }
    })
    this.params["statusconsolidacion"] = selectedEstatusconsolidacion;

    this.params = _.merge(this.params,_.omit(this.simpleForm.value, ['estatusconsolidacion']));
    
    //this.refreshData(this.params);
    let queryParamsfilter : any = {};
    if(_.isEmpty(this.router.snapshot.queryParams)){
      queryParamsfilter["offset"] = 0;
    } 
    //console.log(queryParamsfilter);
    this.route.navigate(["/consolidacion/" , this.segmento], {
      queryParams : queryParamsfilter
    });
  }

  // Form estatusconsolidacion
  get estatusconsolidacion () {
    return this.simpleForm.controls["estatusconsolidacion"] as FormArray;
  }

  // MODAL 
  public visible : any = {
    consolidacionModalEstatus : false,
    consolidacion : false
  };
  currentconsolidacion : any = null;

  openModal(consolidacion: any) {

    if(consolidacion == null) {
      this.visible.consolidacion = !this.visible.consolidacion;
      // null go to newConsolidacionForm
      return
    }

    this.visible.consolidacionModalEstatus = !this.visible.consolidacionModalEstatus;
    this.currentconsolidacion = consolidacion;
    let currentvalues = {
      status : consolidacion.status
    }
    this.changeStatusConsolidacionForm.patchValue(currentvalues);

  }
  
  handleModalChange(event: any, modalid : string) {
    this.visible[modalid] = event;
  } 

  changeStatus() {
    this.consolidacionService.changestatus(
      this.currentconsolidacion.id,
      this.changeStatusConsolidacionForm.value.status
    ).then((res : any)=>{
      Swal.fire("Solicitud Procesada", res.message, res.estatus)
      .then(()=>{
        this.handleModalChange(false, 'consolidacionModalEstatus');
        this.searchFilter();
      });
    }).catch((error)=>{
      Swal.fire('Solicitud no procesada', error.message, 'error');
    })
  }

  saveconsolidacion() {
    // send new consolidacion object
  }

  deleteconsolidacion(item: any) {
    Swal.fire({
      title: 'Estas seguro de Eliminar el ' + this.params["title"],
      icon: 'warning',
      text: "El " + this.params["title"] + " '" + item.codigo + "' será eliminado de la plaforma",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: "No"
    })
      .then((res) => {
        
        if (res.isConfirmed) {
          return this.consolidacionService.delete(item.id);
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

  // ***** CALENDAR RANGE POPUP *****

  get dpFrom() {
    return this.simpleForm.controls['dpFrom'];
  }

  get dpTo() {
    return this.simpleForm.controls['dpTo'];
  }

  calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = null; //this.calendar.getToday();
	toDate: NgbDate | null = null; //this.calendar.getNext(this.calendar.getToday(), 'd', 10);

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : null;
	}

}

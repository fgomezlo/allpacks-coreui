import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule, ContainerComponent, TableModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-print-consolidacion-tracking',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TableModule,
    IconModule,
    ContainerComponent
  ],
  templateUrl: './print-consolidacion-tracking.component.html',
  styleUrl: './print-consolidacion-tracking.component.scss'
})
export class PrintConsolidacionTrackingComponent {

  @Input('data') data : any;
  @Input('listcombos') listcombos : any;
  
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

}

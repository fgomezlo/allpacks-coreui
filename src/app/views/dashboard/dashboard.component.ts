import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';

import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash-es';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [ 
    TextColorDirective, CardComponent, CardBodyComponent, 
    RowComponent, ColComponent, ButtonDirective, 
    IconDirective, ReactiveFormsModule, ButtonGroupComponent, 
    FormCheckLabelDirective, ChartjsComponent, NgStyle, 
    CardFooterComponent, GutterDirective, ProgressBarDirective, 
    ProgressComponent, CardHeaderComponent,
     TableDirective, AvatarComponent, RouterModule, CommonModule]
})
export class DashboardComponent implements OnInit {

  /*readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
*/

  constructor(private authService : AuthService) {}

  ngOnInit(): void {

  }

  isAvailable(rolesAllow: any) {

    let lstAvailbale = rolesAllow.map((item : String)=>{
      return !_.isUndefined(_.find(this.authService.currentUser.roles, {name : item} ));
    });

    return lstAvailbale.indexOf(true) >= 0;
}

}

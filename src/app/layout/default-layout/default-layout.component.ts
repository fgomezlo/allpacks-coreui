import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonModule,
  ContainerComponent,
  FormModule,
  INavData,
  ModalModule,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import * as _ from 'lodash-es';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileValidators } from './profile.validators';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';


function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalModule,
    FormModule,
    ButtonModule
  ]
})
export class DefaultLayoutComponent implements OnInit {
  
  constructor(
    private authService : AuthService,
    private formBuilder : FormBuilder,
    private userService : UserService
  ) {}

  ngOnInit(): void {
    
    /*let permititems:INavData[] = _.remove(navItems,(item =>{
      return _.isUndefined(item.can) || item.can
    })) ;

    this.navItems = navItems;//permititems;
    */
    this.currentuser = this.authService.currentUser;
    if(_.isUndefined(this.currentuser.roles) || _.isEmpty(this.currentuser.roles)) {
      this.navItems = [];
      return;
    }
    
    this.checkAllowMenu(this.currentuser.roles);
    this.loadFormUser();

  }

  checkAllowMenu(roles : []) {
    let allowMenus = navItems.map((item : INavData)=>{
      
      if(_.isUndefined(item.attributes)) {
        item["attributes"] = {
          "allow" : ["Administrador"],
          "active" : true
        };
        console.warn("creating default attributes");
        return item;
      }

      let objtmp = _.find(roles, (o : any)=>{
        if(_.isUndefined(item.attributes)) {
          return false;
        }

        return _.indexOf(item.attributes["allow"], o.name) >= 0;
      });

      item.attributes["active"] = !_.isUndefined(objtmp);
      return item;
    })
    
    allowMenus = _.remove(allowMenus,(allowitem)=>{
      return _.isUndefined(allowitem.attributes) || allowitem.attributes["active"];
    })

    this.navItems = allowMenus;

  }
  
  public navItems : INavData[] = navItems;

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  // modal profile user
  loadFormUser() {

    this.userProfileForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: [''],
        dni: [''],
        password: [''],
        passwordconfirmed: [''],
      },
      {
        validators: [ProfileValidators.matchPasswords],
      }
    );

    // load currentuser information
    this.userProfileForm.patchValue(this.currentuser);
  }

  userProfileForm!: FormGroup;
  currentuser!: any;
  public visible: any = false;

  get name() {
    return this.userProfileForm.controls['name'];
  }
  get password() {
    return this.userProfileForm.controls['password'];
  }
  get passwordconfirmed() {
    return this.userProfileForm.controls['passwordconfirmed'];
  }

  handleProfileModalChange(event: any) {
    this.visible = event;
  }

  updateProfileUser() {
    //console.log('update profile', this.userProfileForm.valid, this.userProfileForm.value);

    if(!this.userProfileForm.valid) {
      console.error("form is invalid", this.userProfileForm.errors);
      return ;
    }

    this.userService
    .updateDataProfile(this.userProfileForm.value)
    .then((res : any)=>{
      return Swal.fire('Resultado de la transacción',res.message,res.code);
    })
    .then((resSwal)=>{
      // close modal
      this.handleProfileModalChange(false);
    })
    .catch((e)=>{
      Swal.fire('UPS !!!',e.message,"error");
    });

  }

  openProfileModal(event : any) {
    this.visible = !this.visible;
    if(this.visible) {
      this.userProfileForm.reset();
      this.userProfileForm.patchValue(this.currentuser);
    }
  }
  
}

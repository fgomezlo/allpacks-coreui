import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  INavData,
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
    DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent implements OnInit {
  
  constructor(private authService : AuthService) {}

  ngOnInit(): void {
    
    /*let permititems:INavData[] = _.remove(navItems,(item =>{
      return _.isUndefined(item.can) || item.can
    })) ;

    this.navItems = navItems;//permititems;
    */
    let currentuser = this.authService.currentUser;
    if(_.isUndefined(currentuser.roles) || _.isEmpty(currentuser.roles)) {
      this.navItems = [];
      return;
    }
    
    this.checkAllowMenu(currentuser.roles);
    
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
}

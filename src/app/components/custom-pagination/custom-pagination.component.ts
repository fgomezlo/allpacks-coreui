import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContainerComponent, PaginationModule } from '@coreui/angular';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [PaginationModule, RouterLink, CommonModule, ContainerComponent],
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss'
})
export class CustomPaginationComponent implements OnChanges{
  
  
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    if(changes["data"]) {
      if(this.data != null) {
        this.pagination.limit = +this.data.limit;
        this.pagination.totalitems = +this.data.totalitems;
        this.pagination.offset = +this.data.offset;
      } else {
        this.pagination.totalitems = 0;
        this.pagination.currentoffset = 0;
        this.pagination.limit = 10;
      }

      this.calcPagination();
    }
  }

  @Input('data') data : any;
  @Input('routerPath') routerPath : string | undefined;

  pagination: any = {
    totalitems: 0,
    pages: [],
    limit: 10,
    currentoffset: 0,
  };

  calcPagination() {

    let pages = this.pagination.totalitems / this.pagination.limit + 1;
    let currentPage = this.pagination.offset / this.pagination.limit + 1;

    let itempages: any[] = [];
    let initpages = (currentPage - 4 > 0 ? currentPage : 5) - 4; 
    for (let i = initpages; i <= pages && i < (initpages + 5) ; i++) {
      let item = {
        offset: (i - 1) * this.pagination.limit,
        pagenumber: i,
        current: currentPage == i,
      };

      itempages.push(item);
    }

    this.pagination.currentoffset = this.pagination.offset;
    this.pagination.pages = itempages;
    //this.pagination.totalitems = +totalitems;
  }

}

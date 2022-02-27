import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {NgToastService} from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crud-app';

  displayedColumns: string[] = ['productName', 'category','date','freshness', 'price', 'comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




constructor(private dialog: MatDialog, private api: ApiService, private toast : NgToastService){

}
  ngOnInit(): void {
    this.getallProducts();
  }



  openDialog() {
    this.dialog.open(DialogComponent, {
     width: '30%',

    
    }).afterClosed().subscribe(val=>{
      if (val==='save'){
        this.getallProducts();
      }
    })
    ;


  }


  getallProducts(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        // console.log(res);
        this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the records !! ");
      }
    })
  }

editProduct(row: any){
  this.dialog.open(DialogComponent,{
    width: '30%',
    data:row
  }).afterClosed().subscribe(val=>{
    if (val==='update'){
      this.getallProducts();
    }
  })
  ;
}

deleteProduct(id:number){
  this.api.deleteProduct(id)
  .subscribe({
    next:(res)=>{
      // alert("product Deleted Successfully");
      this.toast.success({detail:"Deleted!",summary:"Product Deleted Successfully",duration:5000})
      this.getallProducts();
    },
    error:()=>{
      // alert("Error while deleting the record");
      this.toast.error({detail:"Delete Filed!",summary:"Product Deletion Failed",duration:5000})
      this.getallProducts();
    }
  })
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }








}

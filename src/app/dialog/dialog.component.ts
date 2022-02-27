import { Component, Inject, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {NgToastService} from 'ng-angular-popup';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


freshnessList=["Brand New","Second Hand","Refurbished"];

productForm !: FormGroup;
actionBtn: string ="save";

  constructor(private formBuilder : FormBuilder,private toast : NgToastService, 
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
     private dialogRef: MatDialogRef<DialogComponent>) {

    this.productForm= this.formBuilder.group({
      productName: ['',Validators.required],
      category: ['',Validators.required],
      freshness: ['',Validators.required],
      price: ['',Validators.required],
      comment: ['',Validators.required],
      date: ['',Validators.required]
    });
    
    
    
    // console.log(this.editData);

    if (this.editData){
      this.actionBtn = "update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);


    }
   }

  ngOnInit(): void {
  }

  
addproduct(){

  // console.log(this.productForm.value);

 if(!this.editData){
  
  
  if(this.productForm.valid){
    this.api.postProduct(this.productForm.value)
    .subscribe({
    next:(res)=>{
      // alert("Product added successfully");

      this.toast.success({detail:"Product Added!",summary:"Product added successfully",duration:5000});


      
      this.productForm.reset();
      this.dialogRef.close('save');
    },
    error: ()=>{
      // alert("Error while adding the product");
      this.toast.error({detail:"Addition Error!",summary:"Error in adding the product",duration:5000});

    }
    })
  }


} 
  else{
    this.updateProduct();
 }


}


updateProduct(){
  this.api.putProduct(this.productForm.value,this.editData.id)
  .subscribe({
    next:(res)=>{
    // alert("Product updated successfully");
    this.toast.success({detail:"Product Updated!",summary:"Product updated successfully!",duration:5000});

    this.productForm.reset();
    this.dialogRef.close('update');
  },
  error:()=>{
    // alert("Error while updating the record !!!");
    this.toast.error({detail:"Updation Error!",summary:"Error while updating the record !!!",duration:5000});

  }
  })
}

}

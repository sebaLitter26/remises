import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'checkbox',
    template: `
      <div [formGroup]="form" *ngIf="field.opciones && field.opciones.length>0">

      <label  *ngFor="let opt of field.opciones; let i = index" [formArrayName]="field.codigo"  >
        <input type="checkbox" [checked]="field.valor.includes(opt.key)" [formControlName]="i" (click)="selecciono()">
        {{opt.valor}}
        </label>



        </div>


    `
})
export class CheckBoxComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;
    get isValid() { return this.form.controls[this.field.codigo].valid; }
    get isDirty() { return this.form.controls[this.field.codigo].dirty; }



    selecciono() {
        let formulario = this.form.controls[this.field.codigo];
        console.log('selecciono dropdown', formulario);
    }

    isSelected(valor) {
        //console.log('isSelected', valor, this.field.valor.includes(valor));
        return this.field.valor.includes(valor);
    }
}


/*

<div [formGroupName]="field.codigo" >

  <div *ngFor="let opt of field.opciones" class="form-check form-check">
      <label class="form-check-label">
         <input [formControlName]="opt.key" class="form-check-input" name="{{field.codigo}}" type="checkbox" id="inlineCheckbox1" value="opt.value" />
            {{opt.valor}}
        </label>
  </div>
 */

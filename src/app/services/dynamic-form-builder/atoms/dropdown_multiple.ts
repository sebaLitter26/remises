import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'dropdown_multiple',
    template: `
      <div [formGroup]="form">

        <select multiple class="form-control" [formArrayName]="field.codigo"  >
          <option *ngFor="let opt of field.opciones" [selected]="field.valor && field.valor==opt.key" [formControlName]="opt.key" [ngValue]="opt.key">{{opt.valor}}</option>
        </select>
      </div>
    `
})
export class DropDownMultipleComponent {
    @Input() field: any = {};
    @Input() form: FormGroup;

}

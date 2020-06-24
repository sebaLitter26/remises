import { Component, Input } from '@angular/core';

@Component({
    selector: 'field-builder',
    template: `
  <div class="form-group row" [formGroup]="form" >
    <label class="col-md-5 form-control-label" [attr.for]="field.codigo">

      {{field.etiqueta | uppercase}}
      <strong class="text-danger" *ngIf="field.requerido>0">*</strong>
    </label>
    <div class="col-md-7" [ngSwitch]="field.tipo">

      <textbox *ngSwitchCase="'text'" [field]="field" [form]="form"></textbox>
      <dropdown *ngSwitchCase="'dropdown'" [field]="field" [form]="form"></dropdown>
      <dropdown_multiple *ngSwitchCase="'dropdown_multiple'" [field]="field" [form]="form"></dropdown_multiple>
      <checkbox *ngSwitchCase="'checkbox'" [field]="field" [form]="form"></checkbox>

      <radio *ngSwitchCase="'radio'" [field]="field" [form]="form"></radio>
      <file *ngSwitchCase="'file'" [field]="field" [form]="form"></file>
      <div class="alert alert-danger my-1 p-2 fadeInDown animated" *ngIf="!isValid && isDirty">{{field.etiqueta}} is required</div>
    </div>
  </div>
  `
})
export class FieldBuilderComponent {
    @Input() field: any;
    @Input() form: any;

    get isValid() {
        return this.form.controls[this.field.codigo].valid;
    }
    get isDirty() { return this.form.controls[this.field.codigo].dirty; }





}

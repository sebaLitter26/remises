
import { QuestionBase } from '../../../../models/administracion.models/index.models';

export class DropdownQuestion extends QuestionBase<string> {
    controlType = 'dropdown';
    options: { key: string, value: string }[] = [];
    public selectedValue: number;

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];
        //console.log("Estoy en QUESTION_DROPDOWN");
        //console.log(options);
    }
}

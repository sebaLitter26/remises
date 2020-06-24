
import { QuestionBase } from '../../../../models/administracion.models/index.models';

export class SliderQuestion extends QuestionBase<number> {
    controlType = 'slider';
    value: number;

    constructor(value: {} = {}) {
        super(value);
        //options.valor = (options.valor && options.valor==1) ? true: false;
        this.value = value['value'] || 0;
    }
}

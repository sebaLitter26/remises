export class Calle {
    public alias: string;
    public altura: number;
    public desde_impa: number;
    public desde_par: number;
    public desde_x: number;
    public desde_y: number;
    public hasta_impa: number;
    public hasta_par: number;
    public hasta_x: number;
    public hasta_y: number;
    public idcallejero: number;
    public localidad: string;
    public nombre: string;
    public sentido: number;
    public tipocalle: number;

    public constructor(init?: Partial<Calle>) {
        Object.assign(this, init);
    }

}

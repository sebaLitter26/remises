export class Viaje {
    public lat: number = undefined;
    public lon: number = undefined;

    public fechaeventual: Date = null;
    public horaeventual: string = '';
    public tiempoantes: string = '';

    public cantidad: any = 0;
    //public id_pasajero: number = 0;
    public telefono: string = '';
    public calle: string = '';
    public altura: string = '';

    public observacion: string = "";

    public localidad: string = '';
    //public provincia: string = '';
    //public departamento: string = '';


    public constructor(init?: Partial<Viaje>) {
        Object.assign(this, init);
    }

}

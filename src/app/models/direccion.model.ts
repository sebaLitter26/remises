export class Direccion {
  public lat: number = undefined;
  public lon: number = undefined;
  public road: string = '';
  //public house_number: number = undefined;
  //public city: string = '';
  public departamento: string = '';
  public state: string = '';
  public id_domicilio: string = '';
  public country_code: string = '';
  public state_district: string = '';
  public postcode: string = '';
  public country: string = 'Argentina';

  public osm_value: string = '';    //Debería usarlo para ver si es "house_number"
  public osm_key: string = '';
  public name: string = '';         //Name es el nombre de la calle cuando NO tiene housenumber
  public street: string = '';       //Street es el nombre de la calle cuando SÍ tiene housenumber
  public housenumber: string = undefined;
  public inverseGeocoding: boolean = false;
  public localidad: string = '';

  public constructor(init?: Partial<Direccion>) {
    Object.assign(this, init);
  }
}

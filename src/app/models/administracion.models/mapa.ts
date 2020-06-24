export class Mapa{
	public widh: number;
	public tipo: string;
	public nombre: string;

  public width: number;
  public height: number;
  public permisos: boolean;
  public marcadores: any;
  public coordenadas : {'lat': number, 'lng': number};

	constructor(init?:Partial<Mapa>) {
					Object.assign(this, init);
	}
}

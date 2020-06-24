export class Empresa{
	public id:number;
	public codigo: string;
	public foto: string;
	public numerotelefono: string;
	public estado: number;
	public id_provincia: number;
	public telefono: string;
	public id_usuarioubi: number;
	public hostname: string;
	public home: string;
	public googleapikey: string;
	public permitemascotas: number;
	public usacallejero: number;
	public prefijotelefonico: string;
	public lon: number;
	public lat: number;
	public centromapa: string;
	public localidad: string;

	constructor(init?:Partial<Empresa>){
		Object.assign(this, init);
	}
}

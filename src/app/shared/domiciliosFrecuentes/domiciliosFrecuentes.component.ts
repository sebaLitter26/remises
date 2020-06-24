import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';

import { UbicacionService } from '../../services/ubicacion.service';

interface objetoPorLocalidad {
  localidad: String;
  domicilios: any[];
}

@Component({
    selector: 'domicilios-frecuentes',
    templateUrl: './domiciliosFrecuentes.component.html',
    styleUrls: ['./domiciliosFrecuentes.component.scss'],
})

export class DomiciliosFrecuentes {
    localidades_domicilios: any[];
    domiciliosPasajero = new FormControl();

    constructor(
        private router: Router,
        public _ubi: UbicacionService,
    ) { }

    obtener_array_domiciliosFrecuentes(){
      this.localidades_domicilios= [];
      if(this._ubi.usuario_logueado){
        this._ubi.localidades.forEach(localidadPosible=>{
          var elementoTemporal: objetoPorLocalidad;
          elementoTemporal={
            localidad: '',
            domicilios: [],
          };
          elementoTemporal.localidad=localidadPosible;
          this._ubi.domiciliosPasajero.forEach(domicilio=>{
            if(domicilio.localidad==localidadPosible)
                elementoTemporal.domicilios.push(domicilio)
          });
          if(elementoTemporal.domicilios.length>0)
            this.localidades_domicilios.push(elementoTemporal)
        });
      }
    }

    busqueda_domicilio_frecuente(){
      if(!this._ubi.domiciliosPasajero&&this._ubi.usuario_logueado){
        this._ubi.getDomiciliosPasajero();
        setTimeout(()=>{this.obtener_array_domiciliosFrecuentes();}, 1000);
      }
    }
}

import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/administracion.services/index.services';

@Component({
    selector: 'app-administracion',
    templateUrl: './administracion.component.html',
    styleUrls: ['./administracion.component.scss'],
    providers: [UserService]
})
export class AdministracionComponent implements OnInit, DoCheck {
    public identity;
    public token;
    public devolucion;

    constructor(
        private _userService: UserService,
    ) {
        console.log('administracion.component cargado');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit() {


        var OneSignal = window['OneSignal'] || [];

        OneSignal.push(["init", {
            appId: "38224aad-d781-4ee9-a268-e250217637ea",
            autoRegister: true,
            allowLocalhostAsSecureOrigin: true,
            //subdomainName: 'https://something.onesignal.com',
            httpPermissionRequest: {
                enable: true
            },
            notifyButton: {
                enable: true
            }
        }]);


        OneSignal.push(() => {
            OneSignal.setDefaultTitle('NOTIFICATIONS');

            OneSignal.getUserId()
                .then((id) => {
                    if (id !== null) {
                        //signalUserId = id;
                        let data = { push_token: id };
                        console.log(data);
                        // Make a POST call to your server with the user ID
                        //this.send_token(data);
                        //compareUserPermission(); // compare the properties
                    } else {
                        // /registerDevice(); // register the device
                    }
                })
                .catch((err) => {
                    console.log('getUserId err', err);
                });
        });
        console.log("Componente Inicio");
    }

    send_token(data) {
        this._userService.send_pushId(data).subscribe(
            response => {
                if (response.status == 'success') {
                    console.log("El servidor recibió correctamente su push_token:", response);
                    //this.columnDefs = response.campos;
                }
                else {
                    console.log("Fallo al registrar las notificaciones!", response);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    ngDoCheck() {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
}

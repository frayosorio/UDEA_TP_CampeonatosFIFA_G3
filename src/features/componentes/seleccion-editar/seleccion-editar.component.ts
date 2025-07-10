import { Component, Inject } from '@angular/core';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';

export interface DatosEdicionSeleccion {
  seleccion: Seleccion;
  encabezado: string;
}

@Component({
  selector: 'app-seleccion-editar',
  imports: [
    FormsModule,
    ReferenciasMaterialModule
  ],
  templateUrl: './seleccion-editar.component.html',
  styleUrl: './seleccion-editar.component.css'
})
export class SeleccionEditarComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionSeleccion,
    private dialogoReferencia: MatDialogRef<SeleccionEditarComponent>
  ) {

  }

  cerrar() {
    this.dialogoReferencia.close();
  }

}

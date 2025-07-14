import { Component, Inject } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { Campeonato } from '../../../shared/entidades/campeonato';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { NgFor } from '@angular/common';

export interface DatosEdicionCampeonato {
  campeonato: Campeonato;
  encabezado: string;
  selecciones: Seleccion[]
}

@Component({
  selector: 'app-campeonato-editar',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgFor
  ],
  templateUrl: './campeonato-editar.component.html',
  styleUrl: './campeonato-editar.component.css'
})
export class CampeonatoEditarComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public datos: DatosEdicionCampeonato,
    private dialogoReferencia: MatDialogRef<CampeonatoEditarComponent>
  ) {
  }

  cerrar() {
    this.dialogoReferencia.close();
  }

  compararPaises(pais1: Seleccion, pais2: Seleccion): boolean {
    return pais1 && pais2 ? pais1.id == pais2.id : pais1 == pais2;
  }

}

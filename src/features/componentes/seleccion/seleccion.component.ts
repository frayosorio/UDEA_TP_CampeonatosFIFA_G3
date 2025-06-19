import { Component, OnInit } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SeleccionService } from '../../../core/servicios/seleccion.service';
import { Seleccion } from '../../../shared/entidades/seleccion';

@Component({
  selector: 'app-seleccion',
  imports: [
    ReferenciasMaterialModule,
    FormsModule,
    NgxDatatableModule,
  ],
  templateUrl: './seleccion.component.html',
  styleUrl: './seleccion.component.css'
})
export class SeleccionComponent implements OnInit {

  constructor(private seleccionServicio: SeleccionService) {

  }

  ngOnInit(): void {
    this.listar();
  }

  public textoBusqueda: string = "";
  public selecciones: Seleccion[] = []
  public columnas = [
    { prop: "nombre", name: "Nombre de Selección" },
    { prop: "entidad", name: "Entidad regente del Fútbol" },
  ]
  public modoColumna = ColumnMode;


  private listar() {
    this.seleccionServicio.listar().subscribe({
      next: (response) => {
        this.selecciones = response;
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  public buscar() {
    if (this.textoBusqueda) {
      this.seleccionServicio.buscar(this.textoBusqueda).subscribe({
        next: (response) => {
          this.selecciones = response;
        },
        error: (error) => {
          window.alert(error.message);
        }
      });
    }
    else {
      this.listar();
    }
  }

  public agregar() {

  }

  public modificar() {

  }

  public eliminar() {

  }
}

import { Component, OnInit } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { FormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { SeleccionService } from '../../../core/servicios/seleccion.service';
import { Seleccion } from '../../../shared/entidades/seleccion';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionEditarComponent } from '../seleccion-editar/seleccion-editar.component';
import { DecidirComponent } from '../../../shared/componentes/decidir/decidir.component';

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

  constructor(private seleccionServicio: SeleccionService,
    private dialogoServicio: MatDialog
  ) {

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
  public tipoSeleccion = SelectionType;

  private seleccionEscogida: Seleccion | undefined;
  private indiceSeleccionEscogida: number = -1;


  public escoger(evt: any) {
    if (evt.type == "click") {
      this.seleccionEscogida = evt.row;
      this.indiceSeleccionEscogida = this.selecciones.findIndex(seleccion => seleccion == this.seleccionEscogida);
    }
  }

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
    const dialogo = this.dialogoServicio.open(SeleccionEditarComponent, {
      width: "500px",
      height: "300px",
      data: {
        encabezado: "Agregando nueva selección de fútbol",
        seleccion: {
          id: 0,
          nombre: "",
          entidad: ""
        }
      },
      disableClose: true
    });

    dialogo.afterClosed().subscribe({
      next: (seleccion) => {
        if (seleccion) {
          this.seleccionServicio.agregar(seleccion).subscribe({
            next: (seleccion) => {
              this.textoBusqueda = seleccion.nombre;
              this.buscar();
            },
            error: (error) => {
              window.alert(error.message);
            }
          });
        }
      },
      error: (error) => {
        window.alert(error);
      }
    });
  }

  public modificar() {
    const dialogo = this.dialogoServicio.open(SeleccionEditarComponent, {
      width: "500px",
      height: "300px",
      data: {
        encabezado: `Modificando la selección [${this.seleccionEscogida?.nombre}]`,
        seleccion: this.seleccionEscogida
      },
      disableClose: true
    });

    dialogo.afterClosed().subscribe({
      next: (seleccion) => {
        if (seleccion) {
          this.seleccionServicio.modificar(seleccion).subscribe({
            next: (seleccion) => {
              this.listar();
            },
            error: (error) => {
              window.alert(error.message);
            }
          });
        }
      },
      error: (error) => {
        window.alert(error);
      }
    });
  }

  public eliminar() {
    if (this.seleccionEscogida) {
      const dialogo = this.dialogoServicio.open(DecidirComponent, {
        width: "400px",
        height: "200px",
        data: {
          mensaje: `Está seguro de eliminar la selección [${this.seleccionEscogida?.nombre}]`,
          id: this.seleccionEscogida?.id
        },
        disableClose: true
      });

      dialogo.afterClosed().subscribe({
        next: (id) => {
          if (id) {
            this.seleccionServicio.eliminar(id).subscribe({
              next: (eliminado) => {
                if(eliminado)
                  this.listar();
                else{
                  window.alert("No se puede elimnar la selección");
                }
              },
              error: (error) => {
                window.alert(error.message);
              }
            });
          }
        },
        error: (error) => {
          window.alert(error);
        }
      });

    }
    else {
      window.alert("Debe escoger una Selección de Fútbol");
    }
  }
}

import { Component } from '@angular/core';
import { ReferenciasMaterialModule } from '../../../shared/modulos/referencias-material.module';
import { ColumnMode, NgxDatatableModule, SelectionType } from '@swimlane/ngx-datatable';
import { CampeonatoService } from '../../../core/servicios/campeonato.service';
import { MatDialog } from '@angular/material/dialog';
import { Campeonato } from '../../../shared/entidades/campeonato';
import { CampeonatoEditarComponent } from '../campeonato-editar/campeonato-editar.component';
import { DecidirComponent } from '../../../shared/componentes/decidir/decidir.component';
import { FormsModule } from '@angular/forms';
import { SeleccionService } from '../../../core/servicios/seleccion.service';
import { Seleccion } from '../../../shared/entidades/seleccion';

@Component({
  selector: 'app-campeonato',
  imports: [
    ReferenciasMaterialModule,
    NgxDatatableModule,
    FormsModule
  ],
  templateUrl: './campeonato.component.html',
  styleUrl: './campeonato.component.css'
})
export class CampeonatoComponent {

  constructor(private campeonatoServicio: CampeonatoService,
    private seleccionServicio: SeleccionService,
    private dialogoServicio: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.listar();
    this.listarSelecciones();
  }

  public textoBusqueda: string = "";
  public campeonatos: Campeonato[] = []
  public selecciones: Seleccion[] = []
  public columnas = [
    { prop: "nombre", name: "Nombre del Campeonato" },
    { prop: "año", name: "Año" },
    { prop: "paisOrganizador.nombre", name: "País Organizador" },
  ]
  public modoColumna = ColumnMode;
  public tipoSeleccion = SelectionType;

  private campeonatoEscogido: Campeonato | undefined;
  private indiceCampeonatoEscogido: number = -1;


  public escoger(evt: any) {
    if (evt.type == "click") {
      this.campeonatoEscogido = evt.row;
      this.indiceCampeonatoEscogido = this.campeonatos.findIndex(campeonato => campeonato == this.campeonatoEscogido);
    }
  }

  private listarSelecciones() {
    this.seleccionServicio.listar().subscribe({
      next: (response) => {
        this.selecciones = response;
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  private listar() {
    this.campeonatoServicio.listar().subscribe({
      next: (response) => {
        this.campeonatos = response;
      },
      error: (error) => {
        window.alert(error.message);
      }
    });
  }

  public buscar() {
    if (this.textoBusqueda) {
      this.campeonatoServicio.buscar(this.textoBusqueda).subscribe({
        next: (response) => {
          this.campeonatos = response;
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
    const dialogo = this.dialogoServicio.open(CampeonatoEditarComponent, {
      width: "500px",
      height: "400px",
      data: {
        encabezado: "Agregando nuevo Campeonato de fútbol",
        campeonato: {
          id: 0,
          nombre: "",
          año: new Date().getFullYear(),
          year: new Date().getFullYear(),
          paisOrganizador: {
            id: 0,
            nombre: "",
            entidad: ""
          }
        },
        selecciones: this.selecciones
      },
      disableClose: true
    });

    dialogo.afterClosed().subscribe({
      next: (campeonato) => {
        if (campeonato) {
          this.campeonatoServicio.agregar(campeonato).subscribe({
            next: (campeonato) => {
              this.textoBusqueda = campeonato.nombre;
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
    if (this.campeonatoEscogido) {
      this.campeonatoEscogido.year = this.campeonatoEscogido.año;
      const dialogo = this.dialogoServicio.open(CampeonatoEditarComponent, {
        width: "500px",
        height: "400px",
        data: {
          encabezado: `Modificando el campeonato  [${this.campeonatoEscogido?.nombre}]`,
          campeonato: this.campeonatoEscogido,
          selecciones: this.selecciones
        },
        disableClose: true
      });

      dialogo.afterClosed().subscribe({
        next: (campeonato) => {
          if (campeonato) {
            campeonato.año = campeonato.year;
            this.campeonatoServicio.modificar(campeonato).subscribe({
              next: (campeonato) => {
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
    else {
      window.alert("Debe escoger un campeonato");
    }
  }

  public eliminar() {
    if (this.campeonatoEscogido) {
      const dialogo = this.dialogoServicio.open(DecidirComponent, {
        width: "400px",
        height: "200px",
        data: {
          mensaje: `Está seguro de eliminar el campeonato [${this.campeonatoEscogido?.nombre}]`,
          id: this.campeonatoEscogido?.id
        },
        disableClose: true
      });

      dialogo.afterClosed().subscribe({
        next: (id) => {
          if (id) {
            this.campeonatoServicio.eliminar(id).subscribe({
              next: (eliminado) => {
                if (eliminado)
                  this.listar();
                else {
                  window.alert("No se puede eliminar el campeonato");
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
      window.alert("Debe escoger un Campeonato de Fútbol");
    }
  }

}

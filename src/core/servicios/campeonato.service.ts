import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Campeonato } from '../../shared/entidades/campeonato';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {

    private url: string;

  constructor(private http: HttpClient) {
    this.url = `${environment.urlBase}campeonatos/`;
  }

  public listar(): Observable<Campeonato[]> {
    return this.http.get<Campeonato[]>(`${this.url}listar`);
  }

  public buscar(texto: string): Observable<Campeonato[]> {
    return this.http.get<Campeonato[]>(`${this.url}buscar/${texto}`);
  }

  public agregar(seleccion: Campeonato): Observable<Campeonato> {
    return this.http.post<Campeonato>(`${this.url}agregar`, seleccion);
  }

  public modificar(seleccion: Campeonato): Observable<Campeonato> {
    return this.http.put<Campeonato>(`${this.url}modificar`, seleccion);
  }

  public eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}eliminar/${id}`);
  }

}

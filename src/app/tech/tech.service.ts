import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, combineLatest, merge, from, of} from "rxjs";
import {environment} from "../../environments/environment";
import {flatMap, concatMap, delay} from "rxjs/operators";
import {BackendLink} from "./tech.domains";


/**
 * Service donnant accès aux informations techniques.
 */
@Injectable({
  providedIn: 'root'
})
export class TechService {

  constructor(private _http:HttpClient) { }

  /**
   * Récupération d'un flux de liens techniques vers le backend.
   *
   * @returns {Observable<BackendLink>}
   */
  listBackendLinks():Observable<BackendLink> {
    return merge(this._http.get(`${environment.baseUrl}${environment.apiActuator}`)
      .pipe(
        flatMap((actuatorData) => Object.entries(actuatorData['_links'])
            .map((entry:[string, any]) => new BackendLink({name: entry[0], href:entry[1].href}))
        )
      ), of(new BackendLink({name: 'versions', href:`${environment.baseUrl}${environment.apiVersion}`})))
      ;
  }

}

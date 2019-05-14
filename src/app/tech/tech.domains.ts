/**
 * Modélisation d'un lien Backend : nom et lien.
 */
export class BackendLink {
  name:string;
  href:string;
  constructor(params:any) {
    Object.assign(this, params);
  }
}

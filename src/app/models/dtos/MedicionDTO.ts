export class MedicionDTO {
  fechaMedicion: Date = new Date();
  idPiscina: number = 0;
  // Presente solo en la respuesta del back al registrar/listar (id generado).
  medicionId?: number;
}
export interface Customer {
    
    id: number;
    name?: string | null;
    status: number;
    email?: string| null;
    empresa?: string| null;
    direccion?: string| null;
    ciudad?: string| null;
    estado?: string| null;
    pais?: string| null;
    destino?: number| null;
    telefono?: string| null;
    notas?: string| null;
    password?: string| null;
    codigo?: string| null;
    sync?: number| null;

}

// src/types/pokemon.types.ts

export interface PokemonDTO {
    id?: number;
    nombre: string;
    tipo?: string;
    nivel?: number;
    fechaCaptura?: string; 
}

export interface PokemonRAW {
    id?: number;
    nombre?: string;
    nivel?: number;
    nombreEntrenador?: string;
    poderTotal?: number;
    esLegendario?: boolean;
}

export interface FilterDTO {
    campo: string;
    operador: string;
    valor: any; 
}

export interface PaginationDTO {
    cantidad: number;
    pagina: number;
}

// ARREGLADO: Ya no es genérico y coincide 100% con C#
export interface RequestListDTO {
    filters?: FilterDTO[];
    pagination?: PaginationDTO;
}

export interface PokemonListResponse {
    data: PokemonDTO[];
    pagination: PaginationDTO;
}
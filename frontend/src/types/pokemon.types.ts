// src/types/pokemon.types.ts

export interface PokemonDTO {
    id?: number;
    nombre: string;
    tipo?: string;
    nivel?: number;
    fechaCaptura?: string; // En C# es DateTime
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

export interface RequestListDTO<T> {
    filters?: FilterDTO[];
    pagination?: PaginationDTO;
}

export interface PokemonListResponse {
    data: PokemonDTO[];
    pagination: PaginationDTO;
}
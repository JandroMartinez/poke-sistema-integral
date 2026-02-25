// src/services/pokemonService.ts
import axios from 'axios';
import type { PokemonDTO, RequestListDTO, PokemonListResponse, PokemonRAW } from '../types/pokemon.types';

const API_URL = 'http://localhost:5225/Pokemon'; 

export const pokemonService = {
    agregar: async (data: PokemonDTO) => {
        const response = await axios.post(`${API_URL}/add`, data);
        return response.data;
    },

    // ARREGLADO: Tipado estricto restaurado
    obtenerLista: async (req: RequestListDTO): Promise<PokemonListResponse> => {
        const response = await axios.post(`${API_URL}/getList`, req);
        return response.data;
    },

    obtenerUno: async (id: number): Promise<PokemonDTO> => {
        const response = await axios.get(`${API_URL}/getSingle`, { params: { id } });
        return response.data;
    },

    obtenerStatus: async (id: number): Promise<PokemonRAW> => {
        const response = await axios.get(`${API_URL}/status`, { params: { id } });
        return response.data;
    },

    actualizar: async (data: PokemonDTO) => {
        const response = await axios.put(`${API_URL}/update`, data);
        return response.data;
    },

    borrar: async (id: number) => {
        const response = await axios.delete(`${API_URL}/delete`, { params: { id } });
        return response.data;
    }
};
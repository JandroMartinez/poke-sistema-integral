// src/services/pokemonService.ts
import axios from 'axios';
import type { PokemonDTO, RequestListDTO, PokemonListResponse, PokemonRAW } from '../types/pokemon.types';

// Asegúrate de cambiar el puerto por el que usa tu API de ASP.NET Core
const API_URL = 'http://localhost:5225/Pokemon'; 

export const pokemonService = {
    // 1. ADD
    agregar: async (data: PokemonDTO) => {
        const response = await axios.post(`${API_URL}/add`, data);
        return response.data;
    },

    // 2. GET LIST
    obtenerLista: async (req: RequestListDTO<PokemonDTO>): Promise<PokemonListResponse> => {
        const response = await axios.post(`${API_URL}/getList`, req);
        return response.data;
    },

    // 3. GET SINGLE
    obtenerUno: async (id: number): Promise<PokemonDTO> => {
        const response = await axios.get(`${API_URL}/getSingle`, { params: { id } });
        return response.data;
    },

    // 4. STATUS (RAW)
    obtenerStatus: async (id: number): Promise<PokemonRAW> => {
        const response = await axios.get(`${API_URL}/status`, { params: { id } });
        return response.data;
    },

    // 5. UPDATE
    actualizar: async (data: PokemonDTO) => {
        const response = await axios.put(`${API_URL}/update`, data);
        return response.data;
    },

    // 6. DELETE
    borrar: async (id: number) => {
        const response = await axios.delete(`${API_URL}/delete`, { params: { id } });
        return response.data;
    }
};
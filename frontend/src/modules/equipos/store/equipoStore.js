import { create } from "zustand";

import {
    getEquipos,
    createEquipo,
    updateEquipo,
    deleteEquipo,
} from "../services/equipoService";

export const useEquipoStore = create(
    (set) => ({

        equipos: [],

        loading: false,

        fetchEquipos: async () => {

            set({
                loading: true,
            });

            try {

                const response =
                    await getEquipos();

                set({
                    equipos:
                        response.data || [],
                });

            } catch (error) {

                console.error(error);

            } finally {

                set({
                    loading: false,
                });

            }
        },

        crearEquipo: async (
            payload
        ) => {

            await createEquipo(
                payload
            );

            await useEquipoStore
                .getState()
                .fetchEquipos();
        },

        editarEquipo: async (
            id,
            payload
        ) => {

            await updateEquipo(
                id,
                payload
            );

            await useEquipoStore
                .getState()
                .fetchEquipos();
        },

        eliminarEquipo: async (
            id
        ) => {

            await deleteEquipo(id);

            await useEquipoStore
                .getState()
                .fetchEquipos();
        },

    })
);
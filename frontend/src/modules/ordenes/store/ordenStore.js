import { create } from "zustand";

import {
    getOrdenes,
    createOrden,
    updateOrden,
    deleteOrden,
} from "../services/ordenService";

export const useOrdenStore = create(
    (set) => ({

        ordenes: [],

        loading: false,

        fetchOrdenes: async () => {

            set({
                loading: true,
            });

            try {

                const response =
                    await getOrdenes();

                set({
                    ordenes:
                        response.data.data || [],
                });

            } catch (error) {

                console.error(error);

            } finally {

                set({
                    loading: false,
                });

            }
        },

        crearOrden: async (payload) => {

            await createOrden(payload);

            await useOrdenStore
                .getState()
                .fetchOrdenes();
        },

        editarOrden: async (
            id,
            payload
        ) => {

            await updateOrden(
                id,
                payload
            );

            await useOrdenStore
                .getState()
                .fetchOrdenes();
        },

        eliminarOrden: async (
            id
        ) => {

            await deleteOrden(id);

            await useOrdenStore
                .getState()
                .fetchOrdenes();
        },

    })
);
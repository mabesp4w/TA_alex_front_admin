/**
 * eslint-disable @typescript-eslint/no-empty-object-type
 *
 * @format
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/services/baseURL";
import { KelasML } from "@/types";

type Store = {
  dtKelasML: KelasML[];
  setKelasML: () => Promise<{
    status: string;
    data?: {};
    error?: {};
  }>;
};

const useKelasMLApi = create(
  devtools<Store>((set) => ({
    dtKelasML: [],
    setKelasML: async () => {
      try {
        const response = await api({
          method: "get",
          url: `/nama-kelas/`,
        });
        set((state) => ({
          ...state,
          dtKelasML: response.data,
        }));
        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
  }))
);

export default useKelasMLApi;

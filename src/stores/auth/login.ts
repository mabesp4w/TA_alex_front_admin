/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth } from "@/services/baseURL";
import Cookies from "js-cookie";
import { User } from "@/types";

// type data login
interface dataLogin {
  name?: string;
  username_or_email: string;
  password: string | number;
  password_confirmation?: string;
}
interface Store {
  setToken: () => Promise<any>;
  dtUser?: User;
  setLogin: (
    data: dataLogin
  ) => Promise<{ status: string; data?: any; error?: any }>;
  setRegister: (
    data: dataLogin
  ) => Promise<{ status: string; data?: any; error?: any }>;
  cekToken: () => Promise<{ status: string; data?: any; error?: any }>;
}

const useLogin = create(
  devtools<Store>((set, get) => ({
    setToken: async () => {
      const getToken = Cookies.get("token");
      return getToken;
    },
    setLogin: async (data) => {
      try {
        const response = await auth({
          method: "post",
          url: `/login/`,
          data,
        });
        return {
          status: "success",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
    setRegister: async (data) => {
      try {
        const response = await auth({
          method: "post",
          url: `/register`,
          data,
        });
        return {
          status: "success",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response.data,
        };
      }
    },
    cekToken: async () => {
      const token = await get().setToken();
      try {
        const response = await auth({
          method: "get",
          url: `/cek_token/`,
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        set((state) => ({ ...state, dtUser: response.data?.user }));
        return {
          status: "success",
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

export default useLogin;

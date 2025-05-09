/** @format */
"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
import useLogin from "@/stores/auth/login";

const Auth = () => {
  // state
  const [isLoading, setIsLoading] = useState(true);
  // pathname
  const pathname = usePathname();
  // router
  const router = useRouter();
  const path = pathname?.split("/");
  const rolePath = path[1];
  const { cekToken } = useLogin();
  const getCek = async () => {
    const res = await cekToken();
    if (res?.error) {
      // redirect to login
      router.push("/auth/login");
      setIsLoading(false);
    } else {
      console.log({ rolePath });
      if (rolePath === "auth") {
        router.push("/");
        setIsLoading(false);
      }
    }
    return res;
  };

  useEffect(() => {
    getCek();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const loadData = async () => {
    await getCek();
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    console.log("pertama render");
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex absolute inset-0 bg-white min-h-screen h-screen justify-center items-center z-50">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
};

export default Auth;

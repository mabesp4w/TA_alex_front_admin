/** @format */

// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "@/stores/auth/login";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setLogin } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error state
    setError("");

    // Form validation
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    // Show loading state
    setLoading(true);

    try {
      const res = await setLogin({ username_or_email: email, password });
      if (res?.status === "success") {
        // add token to cookie
        Cookies.set("token", res.data.token);
        Cookies.set("user_id", res.data.user_id);
        console.log(res);
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      // Handle login error
      setError("Login gagal. Silakan periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-2 bg-cover bg-center">
      {/* Form di sebelah kiri */}
      <div className="w-full xl:w-1/3 md:w-1/2 flex items-center justify-center p-8 bg-neutral/50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-content">Login</h2>
            <p className="text-neutral-content mt-2">
              Masukkan kredensial Anda untuk mengakses sistem
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="nama@contoh.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password Anda"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label justify-end">
                <a
                  href="#"
                  className="label-text-alt link link-hover text-blue-600"
                >
                  Lupa password?
                </a>
              </label>
            </div>

            <div className="form-control">
              <button
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Memproses...
                  </>
                ) : (
                  "Masuk"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

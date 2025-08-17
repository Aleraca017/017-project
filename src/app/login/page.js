"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const token = await cred.user.getIdToken();
      const decoded = jwtDecode(token);

      if (decoded.admin) {
        router.push("/admin/home");
      } else {
        router.push("/client/home");
      }
    } catch (err) {
      console.error(err);
      setErro("Email ou senha inválidos.");
    }
  };

  const handleGoogleLogin = async () => {
    setErro("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken();
      const decoded = jwtDecode(token);

      if (decoded.admin) {
        router.push("/admin/home");
      } else {
        router.push("/client/home");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao logar com o Google.");
    }
  };

  return (
    <>
      <Header />

      <main
        className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login/background.jpg')" }}
      >
        <div className="relative z-10 w-full max-w-3xl p-8 rounded-3xl bg-white/10 backdrop-blur-xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Login normal */}
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-6 text-purple-100 text-center">
              Login
            </h1>
            {erro && <p className="text-red-400 mb-4 text-center">{erro}</p>}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                required
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="p-3 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg shadow-md hover:bg-purple-700 transition hover:cursor-pointer"
              >
                Entrar
              </button>
            </form>
          </div>

          {/* Login com Google */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pl-0 md:pl-6 pt-3">
            <h2 className="text-2xl font-bold mb-6 text-purple-100 text-center ">
              Entrar com Google
            </h2>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-3 bg-white text-gray-700 py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition hover:cursor-pointer"
            >
              <FcGoogle className="w-6 h-6" />
              <span>Continuar com Google</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

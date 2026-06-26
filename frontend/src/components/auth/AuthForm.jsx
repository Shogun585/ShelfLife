import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export function AuthForm() {
  const [mode, setMode] = useState("login");
  
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" 
        ? { email, password } 
        : { name, email, password };

      const response = await api.post(endpoint, payload);

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      
      if (!user.householdId) {
        navigate("/setup");
      } else {
        navigate("/neighborhood");
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4 mt-3 ml-3 px-6 pb-4 sm:px-8 mb-2">
      
      <div className="mx-auto mb-4 flex w-max rounded-full bg-amber-950/20 p-1 shadow-inner backdrop-blur-sm">
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); }}
          className={`rounded-full px-6 py-2 text-sm font-black tracking-wide transition-all duration-300 ${
            mode === "login" 
              ? "bg-amber-100 text-amber-950 shadow-md" 
              : "text-amber-950/60 hover:text-amber-950"
          }`}
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(""); }}
          className={`rounded-full px-6 py-2 text-sm font-black tracking-wide transition-all duration-300 ${
            mode === "register" 
              ? "bg-amber-100 text-amber-950 shadow-md" 
              : "text-amber-950/60 hover:text-amber-950"
          }`}
        >
          REGISTER
        </button>
      </div>

      {mode === "register" && (
        <input
          required
          type="text"
          ref={nameRef}
          placeholder="Your Name"
          className="w-full rounded-xl border-2 border-amber-900/10 bg-amber-50/60 px-5 py-2 font-medium text-amber-950 placeholder-amber-950/50 shadow-inner backdrop-blur-sm outline-none transition-colors transition-shadow placeholder:font-medium focus:border-amber-600 focus:bg-amber-50 focus:shadow-[0_0_15px_rgba(217,119,6,0.2)]"
        />
      )}
      
      <input
        required
        type="email"
        ref={emailRef}
        placeholder="Email Address"
        className="w-full rounded-xl border-2 border-amber-900/10 bg-amber-50/60 px-5 py-2 font-medium text-amber-950 placeholder-amber-950/50 shadow-inner backdrop-blur-sm outline-none transition-colors transition-shadow placeholder:font-medium focus:border-amber-600 focus:bg-amber-50 focus:shadow-[0_0_15px_rgba(217,119,6,0.2)]"
      />
      
      <input
        required
        type="password"
        ref={passwordRef}
        placeholder="Password"
        className="w-full rounded-xl border-2 border-amber-900/10 bg-amber-50/60 px-5 py-2 font-medium text-amber-950 placeholder-amber-950/50 shadow-inner backdrop-blur-sm outline-none transition-colors transition-shadow placeholder:font-medium focus:border-amber-600 focus:bg-amber-50 focus:shadow-[0_0_15px_rgba(217,119,6,0.2)]"
      />

      {error && (
        <div className="text-center text-sm font-bold text-rose-700 drop-shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-br from-amber-800 to-amber-950 px-5 py-2 text-sm font-black tracking-widest text-amber-50 shadow-lg ring-2 ring-amber-900/30 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(120,53,15,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
        
        <span className="relative z-10 uppercase drop-shadow-md">
          {isLoading ? "Loading..." : mode === "login" ? "Enter the neighborhood" : "Move in"}
        </span>
      </button>
    </form>
  );
}
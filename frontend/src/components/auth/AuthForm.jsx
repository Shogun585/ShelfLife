import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export function AuthForm() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 text-amber-950 p-10 pb-10">
      <h1 className="mb-2 text-center font-serif text-3xl font-bold tracking-wide text-amber-950 drop-shadow">
        ShelfLife
      </h1>

      <div className="mx-auto flex rounded-full bg-amber-950/15 p-1 text-xs font-semibold mb-2">
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); }}
          className={`rounded-full px-4 py-1.5 transition ${
            mode === "login" ? "bg-amber-50 text-amber-950 shadow" : "text-amber-950/70"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => { setMode("register"); setError(""); }}
          className={`rounded-full px-4 py-1.5 transition ${
            mode === "register" ? "bg-amber-50 text-amber-950 shadow" : "text-amber-950/70"
          }`}
        >
          Register
        </button>
      </div>

      {mode === "register" && (
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-lg bg-amber-50/90 px-4 py-3 text-sm outline-none ring-amber-900/40 placeholder:text-amber-900/50 focus:ring-2 font-medium"
        />
      )}
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="rounded-lg bg-amber-50/90 px-4 py-3 text-sm outline-none ring-amber-900/40 placeholder:text-amber-900/50 focus:ring-2 font-medium"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="rounded-lg bg-amber-50/90 px-4 py-3 text-sm outline-none ring-amber-900/40 placeholder:text-amber-900/50 focus:ring-2 font-medium"
      />

      {error && <div className="text-red-600 text-sm font-bold text-center">{error}</div>}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 rounded-lg bg-amber-900 px-4 py-3 text-sm font-bold uppercase tracking-wider text-amber-50 shadow-lg transition hover:bg-amber-950 active:translate-y-px disabled:opacity-50"
      >
        {isLoading ? "Loading..." : mode === "login" ? "Enter the neighborhood" : "Move in"}
      </button>
    </form>
  );
}
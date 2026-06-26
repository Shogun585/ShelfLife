import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HangingSign } from "../components/auth/HangingSign";
import { api } from "../lib/api";

export default function HouseholdSetup() {
  const [mode, setMode] = useState("create");
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "create") {
        
        await api.post("/households", { name: inputValue });
      } else {
        
        await api.post("/households/join", { inviteCode: inputValue });
      }
      
      
      navigate("/neighborhood");
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to setup household.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100">
      <HangingSign>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 text-amber-950 pl-10 pb-10 pr-8">
          <h1 className="mb-6 text-center font-serif text-2xl font-bold tracking-wide text-amber-950 drop-shadow">
            Where do you live?
          </h1>

          <div className="mx-auto flex rounded-full bg-amber-950/15 p-1 text-xs font-semibold mb-2">
            <button
              type="button"
              onClick={() => { setMode("create"); setInputValue(""); setError(""); }}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === "create" ? "bg-amber-50 text-amber-950 shadow" : "text-amber-950/70"
              }`}
            >
              Create New
            </button>
            <button
              type="button"
              onClick={() => { setMode("join"); setInputValue(""); setError(""); }}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === "join" ? "bg-amber-50 text-amber-950 shadow" : "text-amber-950/70"
              }`}
            >
              Join Existing
            </button>
          </div>

          <p className="text-center text-xs font-medium text-amber-900/80 mb-2">
            {mode === "create" 
              ? "Give your new apartment or house a name." 
              : "Enter the invite code."}
          </p>

          <input
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={mode === "create" ? "e.g. Apartment 7" : "e.g. A1B2C3"}
            className="rounded-lg bg-amber-50/90 px-4 py-3 text-sm outline-none ring-amber-900/40 placeholder:text-amber-900/50 focus:ring-2 font-medium uppercase text-center"
          />

          {error && <div className="text-red-600 text-sm font-bold text-center">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-amber-900 px-4 py-3 text-sm font-bold uppercase tracking-wider text-amber-50 shadow-lg transition hover:bg-amber-950 active:translate-y-px disabled:opacity-50"
          >
            {isLoading ? "Processing..." : mode === "create" ? "Sign the lease" : "Move in"}
          </button>
        </form>
      </HangingSign>
    </div>
  );
}
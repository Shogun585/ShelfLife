import { HangingSign } from "../components/auth/HangingSign";
import { AuthForm } from "../components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100">
      <div className="absolute inset-0 opacity-60" style={{
        backgroundImage: "radial-gradient(closest-side, rgba(255,255,255,0.9), transparent 70%), radial-gradient(closest-side, rgba(255,255,255,0.8), transparent 70%)",
        backgroundPosition: "10% 20%, 80% 30%",
        backgroundSize: "260px 120px, 320px 140px",
        backgroundRepeat: "no-repeat",
      }} />
      <HangingSign>
        <AuthForm />
      </HangingSign>
    </div>
  );
}
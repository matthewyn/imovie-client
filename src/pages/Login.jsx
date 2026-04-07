// src/pages/Login.jsx
import LoginCard from "../components/LoginCard";
import waveImg from "../assets/wave.png";

function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient with quote */}
      <div
        className="hidden md:flex flex-col justify-between w-[48%] p-8 text-white"
        style={{
          backgroundImage: `url(${waveImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs tracking-widest uppercase opacity-80">
            Now Showing
          </span>
          <div className="flex-1 h-px bg-white/30" />
        </div>
        <div>
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Your Story Starts at the Cinema
          </h2>
          <p className="text-sm opacity-75 leading-relaxed max-w-xs">
            Grab your seat, dim the lights — the magic of the big screen is
            waiting for you.
          </p>
        </div>
      </div>

      {/* Right panel — your existing LoginCard, untouched */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <LoginCard />
      </div>
    </div>
  );
}

export default Login;

import SignUpCard from "../components/SignUpCard";
import Lottie from "lottie-react";
import abstractWaves from "../assets/abstract-waves.json";

function SignUp() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-[48%] p-8 text-white relative overflow-hidden bg-[#0d0015]">
        {/* Lottie wave — fills the entire panel behind text */}
        <Lottie
          animationData={abstractWaves}
          loop={true}
          autoplay={true}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Text content */}
        <div className="relative z-10 flex items-center gap-3">
          <span className="text-xs tracking-widest uppercase opacity-80">
            Now Showing
          </span>
          <div className="flex-1 h-px bg-white/30" />
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Your Story Starts at the Cinema
          </h2>
          <p className="text-sm opacity-75 leading-relaxed max-w-xs">
            Grab your seat, dim the lights — the magic of the big screen is
            waiting for you.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <SignUpCard />
      </div>
    </div>
  );
}

export default SignUp;

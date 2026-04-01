import { useEffect, useRef, useState } from "react";

function NotFound() {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animated arc/glow canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Pulsing arc glow
      const pulse = 0.85 + Math.sin(t * 0.02) * 0.15;
      const cx = width / 2;
      const cy = height * 1.08;
      const rx = width * 0.52 * pulse;
      const ry = height * 0.72 * pulse;

      // Outer soft glow
      const grad = ctx.createRadialGradient(cx, cy, ry * 0.1, cx, cy, ry);
      grad.addColorStop(0, `rgba(180,140,255,${0.13 * pulse})`);
      grad.addColorStop(0.4, `rgba(120,80,220,${0.07 * pulse})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Arc line
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 2 * Math.PI);
      const lineGrad = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
      lineGrad.addColorStop(0, "rgba(100,60,200,0)");
      lineGrad.addColorStop(0.3, `rgba(160,100,255,${0.5 * pulse})`);
      lineGrad.addColorStop(0.5, `rgba(220,180,255,${0.85 * pulse})`);
      lineGrad.addColorStop(0.7, `rgba(160,100,255,${0.5 * pulse})`);
      lineGrad.addColorStop(1, "rgba(100,60,200,0)");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(180,120,255,0.9)";
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Inner brighter arc
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.6, ry * 0.6, 0, Math.PI, 2 * Math.PI);
      const innerGrad = ctx.createLinearGradient(
        cx - rx * 0.6,
        0,
        cx + rx * 0.6,
        0,
      );
      innerGrad.addColorStop(0, "rgba(200,160,255,0)");
      innerGrad.addColorStop(0.5, `rgba(230,200,255,${0.35 * pulse})`);
      innerGrad.addColorStop(1, "rgba(200,160,255,0)");
      ctx.strokeStyle = innerGrad;
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(200,160,255,0.6)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      t++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%, #1a0a2e 0%, #0a0612 40%, #000000 100%)",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
 
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse404 {
          0%, 100% { text-shadow: 0 0 80px rgba(160,100,255,0.25), 0 0 160px rgba(100,60,200,0.1); }
          50%       { text-shadow: 0 0 120px rgba(180,120,255,0.45), 0 0 240px rgba(130,80,220,0.2); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .anim-1 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.1s; }
        .anim-2 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.3s; }
        .anim-3 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.5s; }
        .anim-4 { animation: fadeUp 0.7s ease forwards; opacity: 0; animation-delay: 0.7s; }
        .anim-5 { animation: fadeIn 1s ease forwards; opacity: 0; animation-delay: 0.9s; }
        .num-404 { animation: pulse404 3s ease-in-out infinite; }
        .scanline {
          position: absolute; left: 0; width: 100%; height: 2px;
          background: linear-gradient(transparent, rgba(160,100,255,0.08), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }
        .fp-btn:hover .fp-icon { transform: scale(1.15) rotate(-5deg); }
        .fp-btn:hover { background: rgba(160,100,255,0.12); }
      `}</style>

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-10">
        {/* Canvas arc */}
        <div className="absolute inset-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* 404 */}
        <div className="anim-2 relative mt-16">
          <span
            className="num-404 select-none"
            style={{
              fontSize: "clamp(120px, 22vw, 260px)",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              display: "block",
            }}
          >
            404
          </span>
        </div>

        {/* Subtitle */}
        <p
          className="anim-3 mt-4 text-base md:text-lg tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}
        >
          Scene not found
        </p>

        <p
          className="anim-4 mt-4 text-white/30 text-sm max-w-xs leading-relaxed"
          style={{ fontWeight: 400 }}
        >
          Looks like this reel went missing. The page you're looking for doesn't
          exist.
        </p>

        {/* Back to homepage button */}
        <a
          href="/"
          className="fp-btn anim-4 mt-12 flex flex-col items-center gap-3 group cursor-pointer transition-all rounded-2xl px-6 py-4"
        >
          <div
            className="fp-icon w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300"
            style={{
              border: "1.5px solid rgba(160,100,255,0.5)",
              background: "rgba(120,60,200,0.1)",
            }}
          >
            {/* Film reel icon */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="14"
                cy="14"
                r="11"
                stroke="rgba(200,160,255,0.8)"
                strokeWidth="1.5"
              />
              <circle
                cx="14"
                cy="14"
                r="3"
                stroke="rgba(200,160,255,0.8)"
                strokeWidth="1.5"
              />
              <circle
                cx="14"
                cy="6"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="14"
                cy="22"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="6"
                cy="14"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="22"
                cy="14"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="8.34"
                cy="8.34"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="19.66"
                cy="19.66"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="8.34"
                cy="19.66"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx="19.66"
                cy="8.34"
                r="2"
                stroke="rgba(200,160,255,0.6)"
                strokeWidth="1.2"
              />
            </svg>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors">
            Back to homepage
          </span>
        </a>
      </main>

      {/* FOOTER */}
      <footer className="anim-5 relative z-10 border-t border-white/[0.06] px-8 md:px-14 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/25 mb-1">
              Need help?
            </p>
            <a
              href="mailto:support@imovie.com"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              support@imovie.com
            </a>
          </div>

          {/* Center */}
          <div className="flex gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">
                Browse
              </p>
              <div className="flex flex-col gap-1">
                <a
                  href="/movies"
                  className="text-white/50 hover:text-white/80 transition-colors text-xs underline underline-offset-2 decoration-white/20"
                >
                  Movies
                </a>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">
                Follow us
              </p>
              <div className="flex flex-col gap-1">
                <a
                  href="https://www.instagram.com/_kenneth404"
                  className="text-white/50 hover:text-white/80 transition-colors text-xs underline underline-offset-2 decoration-white/20"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Right */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors text-xs tracking-widest uppercase"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12V2M3 6l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to top
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/20">
            © 2026 — iMovie. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[11px] text-white/20 hover:text-white/50 transition-colors"
            >
              Legal info
            </a>
            <a
              href="#"
              className="text-[11px] text-white/20 hover:text-white/50 transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NotFound;

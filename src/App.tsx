import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence
} from "framer-motion";

const LEACT = ({ className = "" }: { className?: string }) => (
  <span className={`leact-brand ${className}`}>LEACT</span>
);

const Nav = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "product", "asia", "news", "contact"];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="text-2xl">
          <LEACT />
        </a>

        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium">
          {["Home", "About", "Product", "Asia", "News", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-colors ${
                  activeSection === item.toLowerCase()
                    ? "text-white"
                    : "text-gray-400 hover:text-[#FF29B6]"
                }`}
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
};

const SystemMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number;
    let height: number;
    let nodes: Node[] = [];
    let animationId: number;

    const init = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      nodes = Array.from({ length: 10 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        w: 30,
        h: 20,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.strokeRect(n.x, n.y, n.w, n.h);
      });

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full opacity-40" />;
};

const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setPhraseIndex((p) => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(i);
  }, []);

  const phrases = [
    "Build systems,",
    "Run platforms,",
    "Scale with control.",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />

      {/* HERO */}
      <section
        id="home"
        className="h-screen flex items-center max-w-7xl mx-auto px-6"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <Reveal>
            <LEACT className="text-2xl block mb-8" />

            <h1 className="text-5xl font-medium mb-6">
              Structured automation for digital growth.
            </h1>

            <div className="text-xl text-gray-400 flex gap-4">
              {phrases.map((p, i) => (
                <span
                  key={p}
                  className={i === phraseIndex ? "text-white" : ""}
                >
                  {p}
                </span>
              ))}
            </div>

            <a
              href="#product"
              className="inline-block mt-10 px-8 py-4 border border-white hover:border-[#FF29B6]"
            >
              Products
            </a>
          </Reveal>

          <div className="h-[500px]">
            <SystemMap />
          </div>
        </div>
      </section>

      {/* ABOUT (新增修復) */}
      <section id="about" className="py-32 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl mb-6">About</h2>
            <p className="text-gray-400">
              <LEACT /> builds structured digital systems that automate
              operations and support scalable growth.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

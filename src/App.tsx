import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';

const LEACT = ({ className = "" }: { className?: string }) => (
  <span className={`leact-brand ${className}`}>LEACT</span>
);

const Nav = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'product', 'asia', 'news', 'contact'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="text-2xl"><LEACT /></a>
        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-medium">
          {['Home', 'About', 'Product', 'Asia', 'News', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`relative py-1 transition-colors hover:text-[#FF29B6] group ${
                activeSection === item.toLowerCase() ? 'text-white' : 'text-gray-400'
              }`}
            >
              {item}
              <span className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${
                activeSection === item.toLowerCase() ? 'w-full opacity-50' : 'w-0 opacity-0 group-hover:w-full group-hover:bg-[#FF29B6] group-hover:opacity-100 group-hover:shadow-[0_0_8px_#FF29B6]'
              }`} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SystemMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let nodes: any[] = [];
    let connections: any[] = [];
    let particles: any[] = [];
    let animationFrameId: number;

    const init = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      nodes = Array.from({ length: 10 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        w: 30 + Math.random() * 40,
        h: 20 + Math.random() * 30
      }));

      connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (Math.random() > 0.7) connections.push({ from: i, to: j });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(node.x, node.y, node.w, node.h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(node.x, node.y, node.w, node.h);
      });

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      connections.forEach(conn => {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        ctx.beginPath();
        ctx.moveTo(n1.x + n1.w/2, n1.y + n1.h/2);
        ctx.lineTo(n2.x + n2.w/2, n2.y + n2.h/2);
        ctx.stroke();

        if (Math.random() > 0.99) {
          particles.push({
            from: n1,
            to: n2,
            progress: 0,
            speed: 0.005 + Math.random() * 0.01
          });
        }
      });

      ctx.fillStyle = '#FF29B6';
      particles = particles.filter(p => {
        p.progress += p.speed;
        const x = p.from.x + p.from.w/2 + (p.to.x + p.to.w/2 - (p.from.x + p.from.w/2)) * p.progress;
        const y = p.from.y + p.from.h/2 + (p.to.y + p.to.h/2 - (p.from.y + p.from.h/2)) * p.progress;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        return p.progress < 1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full opacity-40" />;
};

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const subheadlinePhrases = [
    "Build systems,",
    "Run platforms,",
    "Scale with control."
  ];

  return (
    <div className="min-h-screen selection:bg-[#FF29B6]/30">
      <Nav />
      
      {/* Hero */}
      <section id="home" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <Reveal>
            <LEACT className="text-2xl block mb-8" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 whitespace-nowrap lg:whitespace-nowrap">
              Structured automation for digital growth.
            </h1>
            <div className="text-xl md:text-2xl text-gray-500 flex gap-3 whitespace-nowrap">
              {subheadlinePhrases.map((phrase, i) => (
                <motion.span
                  key={phrase}
                  animate={{
                    color: i === phraseIndex ? '#ffffff' : '#4b5563',
                    textShadow: i === phraseIndex ? '0 0 15px rgba(255,41,182,0.4)' : 'none'
                  }}
                  className="transition-colors duration-500"
                >
                  {phrase}
                  {i === phraseIndex && (
                    <motion.div
                      layoutId="underline"
                      className="h-px bg-[#FF29B6] mt-1 shadow-[0_0_8px_#FF29B6]"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                    />
                  )}
                </motion.span>
              ))}
            </div>
            <motion.a
              href="#product"
              className="inline-block mt-12 px-10 py-4 border border-white text-xs uppercase tracking-[0.2em] font-medium hover:border-[#FF29B6] hover:text-[#FF29B6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,41,182,0.2)]"
            >
              Products
            </motion.a>
          </Reveal>
          
          <div className="h-[400px] lg:h-[600px] relative">
            <SystemMap />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex gap-12 items-start">
              <div className="w-px h-32 bg-white/10" />
              <div className="max-w-3xl">
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-10">What We Do</h2>
                <p className="text-2xl md:text-3xl font-light leading-relaxed">
                  <LEACT /> builds structured digital systems that automate operations and support scalable growth.
                  We design automation architecture for businesses that need clarity, control, and expansion without operational chaos.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Focus */}
      <section id="product" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-16">Our Focus</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Automation Architecture", desc: "Designing systems that replace manual processes." },
              { title: "Platform Operations", desc: "Building and operating scalable digital platforms." },
              { title: "Structured Growth", desc: "Enabling expansion with logic, control, and structure." }
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="group p-10 border border-white/5 bg-black hover:border-[#FF29B6]/50 transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-lg font-medium mb-4">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-32 border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-10">Platforms</h2>
              <p className="text-xl text-gray-400 mb-12">
                Platforms powered by <LEACT />:<br />
                <span className="text-white font-medium">TouchdownAsia</span> — A structured market entry platform.
              </p>
              <div className="p-12 border border-white/5 relative group bg-black">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">TouchdownAsia</h3>
                  <p className="text-gray-500 mb-8 max-w-sm text-sm">The premier gateway for structured market entry across the Asian digital landscape.</p>
                  <a href="#asia" className="inline-block px-8 py-3 border border-white text-[10px] uppercase tracking-widest hover:border-[#FF29B6] hover:text-[#FF29B6] transition-all">
                    View Platforms
                  </a>
                </div>
                <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity" viewBox="0 0 200 200">
                  <path fill="none" stroke="white" strokeWidth="0.5" d="M40,140 Q60,120 80,130 T120,110 T160,90" />
                </svg>
              </div>
            </Reveal>
            <div className="hidden lg:block">
              <Reveal delay={0.2}>
                <div className="aspect-square border border-white/5 relative flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-64 h-64 border border-white/10 rotate-45"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border border-[#FF29B6]/10 -rotate-12"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Asia */}
      <section id="asia" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-16">Asia</h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="grid grid-cols-4 gap-2 mb-12">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="aspect-square border border-white/5 flex items-center justify-center text-[8px] text-gray-700 font-mono">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 mb-10 text-sm leading-relaxed">
                  Market entry validation matrix: Analyzing regulatory frameworks, digital infrastructure, and consumer behavior patterns across 12 key Asian markets.
                </p>
                <a href="#contact" className="inline-block px-8 py-3 border border-white text-[10px] uppercase tracking-widest hover:border-[#FF29B6] hover:text-[#FF29B6] transition-all">
                  View Asia
                </a>
              </div>
              <div className="bg-white/[0.02] p-12 border border-white/5">
                <div className="space-y-8">
                  {[
                    { label: "Market Readiness", val: "84.2%" },
                    { label: "Regulatory Compliance", val: "VALIDATED" },
                    { label: "Infrastructure Latency", val: "12ms" }
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">{stat.label}</span>
                      <span className="text-xs font-mono text-white">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-16">News</h2>
            <div className="divide-y divide-white/5">
              {[
                { date: "2026.02.15", title: "LEACT expands automation framework to Southeast Asian logistics." },
                { date: "2026.01.28", title: "New platform architecture released for high-frequency operations." },
                { date: "2026.01.10", title: "TouchdownAsia reaches 500+ validated market entry points." }
              ].map((item) => (
                <a key={item.title} href="#" className="group block py-10 hover:px-4 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <span className="text-[10px] font-mono text-gray-600">{item.date}</span>
                    <h3 className="text-xl font-light group-hover:text-[#FF29B6] transition-colors">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-[#FF29B6]">Read More</span>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <Reveal>
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-10">Contact</h2>
              <p className="text-4xl font-light mb-12">Ready to structure your digital growth?</p>
              <div className="space-y-4 text-sm text-gray-500">
                <p>Inquiries: contact@leact.com</p>
                <p>Operations: ops@leact.com</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="group border-b border-white/10 focus-within:border-[#FF29B6] transition-colors">
                  <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">Name</label>
                  <input type="text" className="w-full bg-transparent border-none outline-none text-white py-2 text-sm" placeholder="Your Name" />
                </div>
                <div className="group border-b border-white/10 focus-within:border-[#FF29B6] transition-colors">
                  <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">Email</label>
                  <input type="email" className="w-full bg-transparent border-none outline-none text-white py-2 text-sm" placeholder="email@example.com" />
                </div>
                <div className="group border-b border-white/10 focus-within:border-[#FF29B6] transition-colors">
                  <label className="block text-[8px] uppercase tracking-[0.3em] text-gray-600 mb-2">Message</label>
                  <textarea className="w-full bg-transparent border-none outline-none text-white py-2 text-sm resize-none" rows={3} placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full md:w-auto px-12 py-4 border border-white text-[10px] uppercase tracking-widest font-medium hover:border-[#FF29B6] hover:text-[#FF29B6] transition-all">
                  Send Message
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <Reveal>
              <p className="text-lg text-gray-400">
                Ready to structure your digital growth? Contact <LEACT />.
              </p>
              <p className="text-[8px] uppercase tracking-[0.4em] text-gray-700 mt-4">
                &copy; 2026 LEACT. All rights reserved.
              </p>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-medium">
              {['Home', 'About', 'Product', 'Asia', 'News', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#FF29B6] transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

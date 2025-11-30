import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
    Github,
    Linkedin,
    Mail,
    ExternalLink,
    FileDown,
    MousePointerClick,
    Sparkles,
    Cpu,
    Rocket,
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

// ===== Helper: Neon gradient border wrapper =====
const NeonCard = ({ children, className = "" }) => (
    <div className={`relative rounded-2xl p-[1px] ${className}`}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/70 via-fuchsia-500/70 to-violet-500/70 blur-[10px]" />
        <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            {children}
        </div>
    </div>
);

// ===== Background Particles (canvas) =====
const ParticlesBG = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let w, h, animationId;

        const DPR = window.devicePixelRatio || 1;
        const resize = () => {
            w = canvas.offsetWidth; h = canvas.offsetHeight;
            canvas.width = w * DPR; canvas.height = h * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };
        resize();

        const particles = Array.from({ length: 80 }).map(() => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            r: Math.random() * 2 + 0.6,
        }));

        const tick = () => {
            ctx.clearRect(0, 0, w, h);
            // gradient backdrop haze
            const g = ctx.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, "rgba(0, 255, 255, 0.06)");
            g.addColorStop(0.5, "rgba(255, 0, 255, 0.06)");
            g.addColorStop(1, "rgba(130, 87, 229, 0.06)");
            ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

            particles.forEach((p, i) => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.fill();

                // connections
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 120})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(tick);
        };

        window.addEventListener("resize", resize);
        tick();
        return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-70 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]"
            aria-hidden
        />
    );
};

// ===== Skill Cube (CSS 3D, interactive) =====
const SkillCube = () => {
    const [rot, setRot] = useState({ x: -20, y: 25 });
    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    const onPointerDown = (e) => {
        dragging.current = true;
        const p = 'touches' in e ? e.touches[0] : e;
        last.current = { x: p.clientX, y: p.clientY };
    };
    const onPointerMove = (e) => {
        if (!dragging.current) return;
        const p = 'touches' in e ? e.touches[0] : e;
        const dx = p.clientX - last.current.x;
        const dy = p.clientY - last.current.y;
        last.current = { x: p.clientX, y: p.clientY };
        setRot((r) => ({ x: r.x + dy * 0.6, y: r.y + dx * 0.6 }));
    };
    const onPointerUp = () => { dragging.current = false; };

    useEffect(() => {
  let autoId;

  const autoRotate = () => {
    if (!dragging.current) {
      setRot((r) => ({
        x: r.x + 0.2,  // tilt slowly up/down
        y: r.y + 0.3,  // spin sideways
      }));
    }
    autoId = requestAnimationFrame(autoRotate);
  };

  autoId = requestAnimationFrame(autoRotate);

  return () => cancelAnimationFrame(autoId);
}, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') setRot((r) => ({ ...r, y: r.y - 6 }));
            if (e.key === 'ArrowRight') setRot((r) => ({ ...r, y: r.y + 6 }));
            if (e.key === 'ArrowUp') setRot((r) => ({ ...r, x: r.x - 6 }));
            if (e.key === 'ArrowDown') setRot((r) => ({ ...r, x: r.x + 6 }));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-sm text-white/70">Interactive 3D Skill Cube</div>
            <div
                className="mt-3 mx-auto"
                style={{ perspective: "1000px", width: 260, height: 260 }}
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={onPointerDown}
                onTouchMove={onPointerMove}
                onTouchEnd={onPointerUp}
                role="img"
                aria-label="3D cube showing skills"
            >
                <div
                    className="relative w-full h-full mx-auto transition-transform duration-75"
                    style={{ transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
                >
                    {/* common face styles */}
                    {[
                        { txt: 'React', bg: 'from-cyan-500/30 to-cyan-300/10', tr: 'translateZ(90px)' },
                        { txt: 'Node.js', bg: 'from-emerald-500/30 to-emerald-300/10', tr: 'rotateY(90deg) translateZ(90px)' },
                        { txt: 'Firebase', bg: 'from-amber-500/40 to-amber-300/10', tr: 'rotateY(-90deg) translateZ(90px)' },
                        { txt: 'MongoDB', bg: 'from-green-500/30 to-green-300/10', tr: 'rotateX(90deg) translateZ(90px)' },
                        { txt: 'C++', bg: 'from-blue-500/30 to-blue-300/10', tr: 'rotateX(-90deg) translateZ(90px)' },
                        { txt: 'DSA', bg: 'from-fuchsia-500/30 to-fuchsia-300/10', tr: 'rotateY(180deg) translateZ(90px)' },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className={`absolute inset-0 rounded-2xl border border-white/15 bg-gradient-to-br ${f.bg} flex items-center justify-center text-lg font-semibold backdrop-blur-sm shadow-[0_0_30px_rgba(168,85,247,0.25)]`}
                            style={{ transform: f.tr, width: 180, height: 180, margin: "40px auto" }}
                        >
                            <span className="drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{f.txt}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-2 text-xs text-white/60 text-center">Drag or use arrow keys</div>
            </div>
        </div>
    );
};

// ===== Data =====
const projects = [
    {
        title: "Realtime Chat App",
        tech: ["React", "Firebase", "Auth", "Realtime DB"],
        desc: "A react-based web application that allows users to chat in real time.",
        live: "https://github.com/Tilakmahajan/React-Chat-App", // replace with real link if separate
        repo: "https://github.com/Tilakmahajan/React-Chat-App",
    },
    {
        title: "Get Me Chai ",
        tech: ["JavaScript", "Payments", "Routing"],
        desc: "A user-friendly mobile application that allows for on-demand chai delivery.",
        live: "https://getyourchai.netlify.app/",
        repo: "https://github.com/Tilakmahajan/Get-me-chai",
    },
    {
        title: "Songsa (Music App)",
        tech: ["React", "API", "Audio"],
        desc: "love for music to create a platform that enhances the listening experience of music.",
        live: "https://songsa.netlify.app/",
        repo: "https://github.com/Tilakmahajan/Songsa-web",
    },
    {
        title: "Password Manager",
        tech: ["React", "Tailwind CSS", "MongoDB"],
        desc: "A simple, fast, and secure password manager built for everyday use",
        live: "https://managepaswords.netlify.app/",
        repo: "https://github.com/Tilakmahajan/Password-Manager",
    },
    {
        title: "Coupon Distribution",
        tech: ["React", "Tailwind CSS", "Netlify"],
        desc: "Distribute offers equally with smart round-robin logic—no spam, no bias.",
        live: "https://robincoupondistribution.netlify.app/",
        repo: "https://github.com/Tilakmahajan/Round-Robin-Coupon-distribution",
    },
    {
        title: "Netflix",
        tech: ["HTML", "CSS", "JAVASCRIPT"],
        desc: "A simple Netflix Clone built using HTML, CSS, and JavaScript",
        live: "https://fllixx.netlify.app/",
        repo: "https://github.com/Tilakmahajan/netflix-front",
    },


];

const skills = [
    { subject: "React", A: 90 },
    { subject: "Node", A: 70 },
    { subject: "Firebase", A: 85 },
    { subject: "MongoDB", A: 75 },
    { subject: "C++", A: 80 },
    { subject: "DSA", A: 78 },
];

// ===== Motion helpers =====
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ===== Page Component =====
export default function FuturisticPortfolio() {
    return (
        <div className="min-h-screen bg-[#05060b] text-white selection:bg-fuchsia-500/30 selection:text-white">
            {/* Top nav */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#05060b]/50 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <a href="#hero" className="flex items-center gap-2 font-semibold tracking-wide">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        <span>Tilak.dev</span>
                    </a>
                    <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
                        <a href="#projects" className="hover:text-white">Projects</a>
                        <a href="#experience" className="hover:text-white">skills</a>
                        <a href="#contact" className="hover:text-white">Contact</a>
                        <a
                            href="/Tilak_Mahajan_Resume_2025.pdf"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 hover:border-cyan-400/60 hover:text-cyan-200 transition"
                        >
                            <FileDown className="w-4 h-4" /> Resume
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section id="hero" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(56,189,248,0.25),transparent),radial-gradient(1000px_500px_at_90%_10%,rgba(168,85,247,0.25),transparent)]" />
                <ParticlesBG />
                <div className="max-w-6xl mx-auto px-4 pt-20 pb-28 grid md:grid-cols-2 gap-8 items-center">
                    <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available for Internships
                        </div>
                        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                            Hi, I’m <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Tilak Mahajan</span>
                        </h1>
                        <p className="mt-4 text-white/80 max-w-xl">
                            React + Node developer crafting blazing‑fast web apps with Firebase, REST APIs, and a touch of AI.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#projects"
                                className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 transition"
                            >
                                <MousePointerClick className="w-4 h-4" /> View Projects
                            </a>
                            <a
                                href="mailto:tilakmahajan99@gmail.com"
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 px-5 py-2.5 font-medium shadow-[0_0_30px_-10px_rgba(168,85,247,0.8)] hover:scale-[1.02] transition"
                            >
                                <Rocket className="w-4 h-4" /> Hire Me
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-4 text-white/70">
                            <a href="https://github.com/Tilakmahajan" className="hover:text-white" aria-label="GitHub"><Github /></a>
                            <a href="https://www.linkedin.com/in/tilak-mahajan/" className="hover:text-white" aria-label="LinkedIn"><Linkedin /></a>
                            <a href="mailto:tilakmahajan99@gmail.com" className="hover:text-white" aria-label="Email"><Mail /></a>
                            <a href="https://mahajantilak.netlify.app/" className="hover:text-white" aria-label="Portfolio"><ExternalLink /></a>
                        </div>
                    </motion.div>

                   <spam className="mt-8 ">
                        <SkillCube />
                    </spam>
                </div>
            </section>

            {/* Projects */}
            <section id="projects" className="relative py-20">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0a0b14] to-[#05060b]" />
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-3xl md:text-4xl font-bold"
                    >
                        Featured <span className="text-cyan-300">Projects</span>
                    </motion.h2>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((p, idx) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                            >
                                <NeonCard className="hover:scale-[1.01] transition">
                                    <div className="p-5 flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <Cpu className="w-4 h-4 text-cyan-300" />
                                            <span>{p.title}</span>
                                        </div>
                                        <p className="text-white/80 text-sm leading-relaxed min-h-[60px]">{p.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.tech.map((t) => (
                                                <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70">{t}</span>
                                            ))}
                                        </div>
                                        <div className="mt-2 flex items-center gap-3 text-sm">
                                            <a
                                                href={p.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-cyan-300"
                                            >
                                                Live <ExternalLink className="inline w-4 h-4" />
                                            </a>
                                            <a
                                                href={p.repo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-cyan-300"
                                            >
                                                Code <Github className="inline w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </NeonCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience / Timeline */}
            <section id="experience" className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-3xl md:text-4xl font-bold"
                    >
                        Journey & <span className="text-fuchsia-300">Highlights</span>

                       
                    </motion.h2>
                {/* ==== Timeline ==== */}     
                   <div className="mt-10 relative grid md:grid-cols-2 gap-8">
  
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.15 }}
    className="relative"
  >
     <div className="relative mt-6">
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/60 via-fuchsia-500/60 to-violet-400/60" />
    {[
      {
        year: "2025",
        title: "Oracle OCI AI Foundations (in-progress)",
        desc: "Expanding cloud + AI skills to power production apps.",
      },
      {
        year: "2025",
        title: "Infosys Springboard ",
        desc: "JS + HTML5 foundations certified; strengthening web fundamentals.",
      },
      {
        year: "2025",
        title: "Angular",
        desc: "Completed Angular certification demonstrating skills in frontend development",
      },
      
    ].map((item) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="mt-0.5 w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 shadow-[0_0_20px_-2px_rgba(168,85,247,0.8)]" />
          <div>
            <div className="text-sm text-white/60">{item.year}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="text-white/80 text-sm">{item.desc}</div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
  </motion.div>

 
 {/* ==== Tech Stack Card ==== */}
 
 <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.15 }}
    className="relative"
  >
 <div className="h-full w-100">
    
  <NeonCard>
      <div className="p-3">
        <div className="text-sm text-white/70 absolute top-0 left-56 ">Tech Stack</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["React", "Node", "Firebase", "MongoDB", "C++", "DSA"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#ddd"
                tick={{ fill: "#ddd", fontSize: 12 }}
              />
              <Radar
                name="Skill"
                dataKey="A"
                stroke="#22d3ee"
                fill="#a855f7"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-xs text-white/60">
          * auto-evaluated scale (0–100) — tune in code
        </div>
      </div>
    </NeonCard>
    </div>
    </motion.div>
</div>

                    
                </div>
                
            </section>

            {/* Contact */}
            <section id="contact" className="py-20 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(700px_400px_at_80%_10%,rgba(168,85,247,0.2),transparent),radial-gradient(700px_400px_at_20%_80%,rgba(34,211,238,0.18),transparent)]" />
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-3xl md:text-4xl font-bold"
                    >
                        Let’s <span className="text-cyan-300">Build</span> Something
                    </motion.h2>

                    <div className="mt-10 grid md:grid-cols-2 gap-6 items-stretch">
                        <NeonCard>
                            <form
                                className="p-6 md:p-8 flex flex-col gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = e.currentTarget.name.value;
                                    const body = encodeURIComponent(`Hi Tilak,\n\nI am interested in your profile.\n\n— ${name}`);
                                    window.location.href = `mailto:tilakmahajan1610@gmail.com?subject=Let%27s%20work%20together&body=${body}`;
                                }}
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <input name="name" required placeholder="Your name" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-cyan-400/60" />
                                    <input name="email" required type="email" placeholder="Email" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-cyan-400/60" />
                                </div>
                                <input name="subject" placeholder="Subject (optional)" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-cyan-400/60" />
                                <textarea name="message" rows={5} placeholder="Tell me about your project…" className="rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-cyan-400/60" />
                                <button type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 px-5 py-3 font-medium shadow-[0_0_30px_-10px_rgba(168,85,247,0.8)] hover:scale-[1.02] transition">
                                    <Mail className="w-4 h-4" /> Send Email
                                </button>
                            </form>
                        </NeonCard>

                        <div className="flex flex-col gap-6">
                            <NeonCard>
                                <div className="p-6 md:p-8">
                                    <div className="text-sm text-white/70">Quick Links</div>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <a href="https://github.com/Tilakmahajan" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:border-cyan-400/60">GitHub</a>
                                        <a href="https://www.linkedin.com/in/tilak-mahajan/" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:border-cyan-400/60">LinkedIn</a>
                                        <a href="/Tilak_Mahajan_Resume_2025.pdf" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:border-cyan-400/60">Resume</a>
                                        <a className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:border-cyan-400/60" href="mailto: tilakmahajan1610@gmail.com">Email Us</a>
                                    </div>
                                </div>
                            </NeonCard>
                            <NeonCard>
                                <div className="p-6 md:p-8">
                                    <div className="text-sm text-white/70">Availability</div>
                                    <div className="mt-2 text-white/90">Open for: Internships · Freelance · Collaboration</div>
                                    <div className="mt-4 text-white/60 text-sm">Avg response: within 24h</div>
                                </div>
                            </NeonCard>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-10 border-t border-white/10">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
                    <div>© {new Date().getFullYear()} Tilak Mahajan. Built with ❤ using React, Tailwind & Framer Motion.</div>
                    <div className="flex items-center gap-3">
                        <a href="#hero" className="hover:text-white">Back to top</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

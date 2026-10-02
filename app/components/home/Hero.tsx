"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function Hero() {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-slate-950">
      <AnimatedBackground />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-400/10 to-transparent" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-24">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-sky-100 backdrop-blur-xl"
            >
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50" />

              Polar Science Portal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Explore the science of the{" "}
              <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                polar world.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-slate-300"
            >
              Discover polar research, expeditions, scientific knowledge
              and media from the Arctic and Antarctica.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link
                href="/knowledge"
                className="rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-sky-50"
              >
                Explore Knowledge
              </Link>

              <Link
                href="/expeditions"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/15"
              >
                View Expeditions
              </Link>
            </motion.div>
          </div>

          {/* Right glass panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                  POLAR RESEARCH
                </p>

                <h2 className="mt-4 text-2xl font-semibold text-white">
                  Understanding Earth&apos;s extremes
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Explore scientific work that helps us understand climate,
                  ecosystems, oceans, ice and the changing polar environment.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-white">
                      Arctic
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Northern polar region
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold text-white">
                      Antarctica
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Southern polar region
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-sky-300/10 bg-sky-300/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">
                      Discover
                    </span>

                    <span className="text-right text-sm font-medium text-sky-300">
                      Research · Knowledge · Media
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
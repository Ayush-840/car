'use client';

import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ZondaScrollCanvas from '@/components/ZondaScrollCanvas';
import ZondaExperience from '@/components/ZondaExperience';

export default function Home() {
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <main className="bg-lambo-black min-h-screen">
            <Navbar />

            {/* 
        Master Scroll Container
        Height: 500vh ensures enough scroll distance for the sequence 
      */}
            <section ref={containerRef} className="h-[500vh] relative">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {/* Layer 0: Canvas Background */}
                    <ZondaScrollCanvas
                        scrollYProgress={scrollYProgress}
                        totalFrames={181}
                        imageFolderPath="/images/revuelto-sequence/"
                    />

                    {/* Layer 10: HUD Overlay */}
                    <ZondaExperience scrollYProgress={scrollYProgress} />
                </div>
            </section>

            {/* Footer / Specs Grid Placeholder */}
            <div className="relative z-20 bg-lambo-black/90 backdrop-blur-xl py-32 px-6 border-t border-white/5">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        {[
                            { title: "Aerodynamics", desc: "Active aerodynamic control system with 3-position rear wing." },
                            { title: "Hybrid Heart", desc: "V12 engine coupled with 3 high-density electric motors." },
                            { title: "Carbon Frame", desc: "Monofuselage chassis completely made of forged carbon fiber." },
                            { title: "HMI System", desc: "Immersive interplay between driver and machine." }
                        ].map((feature, i) => (
                            <div key={i} className="group border-t border-white/10 pt-8 hover:border-lambo-yellow/50 transition-colors duration-500">
                                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-lambo-yellow transition-colors">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-light tracking-wide group-hover:text-gray-300 transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-600 tracking-[0.2em] uppercase">
                        <span>&copy; 2026 Lamborghini S.p.A.</span>
                        <div className="flex gap-8">
                            <span className="hover:text-lambo-yellow cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-lambo-yellow cursor-pointer transition-colors">Legal</span>
                            <span className="hover:text-lambo-yellow cursor-pointer transition-colors">Contact</span>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}

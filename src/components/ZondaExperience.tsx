'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import { CAR_DATA } from '@/data/carData';

interface ZondaExperienceProps {
    scrollYProgress: MotionValue<number>;
}

export default function ZondaExperience({ scrollYProgress }: ZondaExperienceProps) {
    // --- Animation Transforms ---

    // HERO: Fade out by 30%
    // HERO: Fade out fast
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // DESIGN: Fade in at 25%, out at 55% (Gap 0.2-0.25)
    const designOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.6], [0, 1, 1, 0]);
    const designY = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.6], [50, 0, 0, -50]);

    // ENGINE: Fade in at 70%, out at 95% (Gap 0.6-0.7)
    // Finishes fading out before 1.0 to clear space for footer
    const engineOpacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 0.95], [0, 1, 1, 0]);
    const engineY = useTransform(scrollYProgress, [0.7, 0.8], [50, 0]);

    // Stagger settings
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as any // Custom "classy" cubic-bezier
            }
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-center">

            {/* SECTION 1: HERO */}
            <motion.div
                style={{ opacity: heroOpacity, y: heroY }}
                initial="hidden"
                animate="show"
                variants={staggerContainer}
                className="container mx-auto px-6 md:px-12 flex flex-col items-start"
            >
                <div className="overflow-hidden">
                    <motion.h1
                        variants={fadeInUp}
                        className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-white mb-4 italic transform -skew-x-12 drop-shadow-2xl"
                    >
                        {CAR_DATA.hero.title}
                    </motion.h1>
                </div>
                <div className="overflow-hidden">
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-lambo-yellow font-exo2 tracking-widest mb-8 border-l-4 border-lambo-yellow pl-4"
                    >
                        {CAR_DATA.hero.price}
                    </motion.p>
                </div>
            </motion.div>

            {/* SECTION 2: DESIGN */}
            <motion.div
                style={{ opacity: designOpacity, y: designY }}
                className="absolute inset-0 flex items-center justify-start container mx-auto px-6 md:px-12"
            >
                <div className="max-w-xl frosted-glass p-10 border-l-4 border-lambo-yellow backdrop-blur-md bg-black/30">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-bold uppercase mb-6 text-white italic"
                    >
                        {CAR_DATA.design.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="text-lg md:text-xl leading-relaxed text-gray-200 font-inter font-light"
                    >
                        {CAR_DATA.design.description}
                    </motion.p>
                </div>
            </motion.div>

            {/* SECTION 3: ENGINE */}
            <motion.div
                style={{ opacity: engineOpacity, y: engineY }}
                className="absolute inset-0 flex items-center justify-end container mx-auto px-6 md:px-12"
            >
                <div className="text-right">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase mb-10 text-white italic">
                        {CAR_DATA.engine.title}
                    </h2>
                    <div className="flex flex-col gap-8">
                        {CAR_DATA.engine.specs.map((spec, index) => (
                            <div key={index} className="flex flex-col items-end group">
                                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2 group-hover:text-lambo-yellow transition-colors duration-300">
                                    {spec.label}
                                </span>
                                <span className="text-4xl md:text-6xl font-exo2 font-black text-white group-hover:text-lambo-yellow transition-colors duration-300">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs tracking-[0.2em] uppercase text-gray-400">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-lambo-yellow to-transparent"></div>
            </motion.div>

        </div>
    );
}

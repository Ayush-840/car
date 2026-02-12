import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-6 md:px-12 transition-all duration-500">
            <div className="absolute inset-0 frosted-glass border-b border-white/5 mask-gradient opacity-90" />

            <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
                <Link href="/" className="group flex items-center gap-3">
                    <span className="font-exo2 text-2xl md:text-3xl font-bold tracking-tighter text-white transition-colors group-hover:text-lambo-yellow">
                        LAMBORGHINI
                    </span>
                    <span className="hidden md:block w-px h-6 bg-white/20 mx-2" />
                    <span className="hidden md:block font-inter text-xs tracking-[0.2em] text-gray-400 uppercase">
                        Revuelto
                    </span>
                </Link>

                <button className="group relative px-8 py-3 overflow-hidden text-xs font-bold tracking-[0.2em] uppercase text-white transition-all duration-300">
                    <span className="absolute inset-0 border border-white/20 group-hover:border-lambo-yellow transition-colors duration-300" />
                    <span className="absolute inset-0 bg-lambo-yellow/0 group-hover:bg-lambo-yellow/10 transition-colors duration-300" />
                    <span className="relative z-10 group-hover:text-lambo-yellow transition-colors duration-300">
                        Inquire
                    </span>
                </button>
            </div>
        </nav>
    );
}

import type { Metadata } from 'next';
import { Inter, Exo_2 } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const exo2 = Exo_2({
    subsets: ['latin'],
    variable: '--font-exo2',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Lamborghini Revuelto Showcase',
    description: 'Experience the Lamborghini Revuelto in a 360-degree interactive showcase.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${exo2.variable}`}>
            <body className="bg-lambo-black text-white antialiased font-sans selection:bg-lambo-yellow selection:text-black">
                {children}
            </body>
        </html>
    );
}

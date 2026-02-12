'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, MotionValue } from 'framer-motion';

interface ZondaScrollCanvasProps {
    scrollYProgress: MotionValue<number>;
    totalFrames?: number;
    imageFolderPath?: string;
}

export default function ZondaScrollCanvas({
    scrollYProgress,
    totalFrames = 181,
    imageFolderPath = '/images/revuelto-sequence/',
}: ZondaScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loadedCount, setLoadedCount] = useState(0);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Load all images on mount
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];

            // Pre-fill array with empty images relative to totalFrames
            // We want to keep the order correct, so we'll init the array
            // and then update it? No, images are objects. 
            // Better to create all Image objects first, then attach onload.

            for (let i = 0; i < totalFrames; i++) {
                const img = new Image();
                const frameIndex = i + 1;
                const filename = `frame-${String(frameIndex).padStart(3, '0')}.jpg`;
                img.src = `${imageFolderPath}${filename}`;

                img.onload = () => {
                    setLoadedCount(prev => prev + 1);
                };

                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        loadImages();
    }, [totalFrames, imageFolderPath]);

    useEffect(() => {
        if (loadedCount === totalFrames) {
            setImagesLoaded(true);
        }
    }, [loadedCount, totalFrames]);

    // Render logic
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        // Allow rendering if the image exists and is complete (loaded)
        // We don't wait for ALL images to load anymore for the first frame
        if (!canvas || !images[index] || !images[index].complete) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // Only resize if necessary to avoid clearing the canvas unnecessarily
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        // Reset scale for every draw if we didn't resize? 
        // Actually, if we stick to the resize logic above, we need to ensure scale is correct.
        // It's safer to always set dimensions and scale for this use case if we want responsiveness.
        // But for performance, let's keep it simple: just overwrite.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Draw image contain logic
        const img = images[index];
        const canvasRatio = rect.width / rect.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawHeight = rect.height;
            drawWidth = img.width * (rect.height / img.height);
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = rect.width;
            drawHeight = img.height * (rect.width / img.width);
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (images.length === 0) return;

        // Map 0-1 to 0-(totalFrames-1)
        const frameIndex = Math.min(
            totalFrames - 1,
            Math.floor(latest * totalFrames)
        );

        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Initial render when first image loaded or images set
    useEffect(() => {
        // Try to render the first frame as soon as possible
        if (images.length > 0 && images[0]?.complete) {
            renderFrame(0);
        }
    }, [images, loadedCount]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const currentProgress = scrollYProgress.get();
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(currentProgress * totalFrames)
            );
            if (images.length > 0) renderFrame(frameIndex);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [images, scrollYProgress, totalFrames]);

    const progress = Math.min(100, (loadedCount / totalFrames) * 100);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-0"
            />
            {/* Loading Indicator - Subtle 'Classy' Bar */}
            {!imagesLoaded && (
                <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.2 }}
                        className="h-full bg-lambo-yellow shadow-[0_0_10px_rgba(219,255,0,0.5)]"
                    />
                </div>
            )}
        </>
    );
}

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
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Load all images on mount
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        // Pre-fill array
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            const frameIndex = i + 1;
            const filename = `frame-${String(frameIndex).padStart(3, '0')}.jpg`;
            img.src = `${imageFolderPath}${filename}`;

            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true);
                }
            };

            loadedImages.push(img);
        }

        setImages(loadedImages);
    }, [totalFrames, imageFolderPath]);

    // Render logic
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index] || !images[index].complete) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;

        // Set canvas dimensions if not set (or on resize, but basic for now)
        // We assume the canvas is sized via CSS (w-full h-full)
        // But we need to set internal width/height to match display size * dpr
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Draw image contain logic
        // We want object-fit: contain manually
        const img = images[index];
        const canvasRatio = rect.width / rect.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image -> fit by height
            drawHeight = rect.height;
            drawWidth = img.width * (rect.height / img.height);
            offsetX = (rect.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Canvas is taller than image -> fit by width
            drawWidth = rect.width;
            drawHeight = img.height * (rect.width / img.width);
            offsetX = 0;
            offsetY = (rect.height - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, rect.width, rect.height);
        // ctx.fillStyle = '#1a1a1a'; // Optional background clear
        // ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (!imagesLoaded || images.length === 0) return;

        // Map 0-1 to 0-(totalFrames-1)
        const frameIndex = Math.min(
            totalFrames - 1,
            Math.floor(latest * totalFrames)
        );

        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Initial render when loaded
    useEffect(() => {
        if (imagesLoaded) {
            renderFrame(0);
        }
    }, [imagesLoaded]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            const currentProgress = scrollYProgress.get();
            const frameIndex = Math.min(
                totalFrames - 1,
                Math.floor(currentProgress * totalFrames)
            );
            if (imagesLoaded) renderFrame(frameIndex);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded, scrollYProgress, totalFrames]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-0"
        />
    );
}

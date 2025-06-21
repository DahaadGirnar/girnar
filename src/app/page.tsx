"use client";

import { motion } from "motion/react";
import React, { useRef } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Image from "next/image";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { LampContainer } from "@/components/ui/lamp";
import Carousel from "@/components/ui/carousel";
import Link from "next/link";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const images = [
    "/images/hero/2.jpg",
    "/images/hero/3.jpg",
    "/images/hero/1.jpg",
    "/images/hero/4.jpg",
  ];

  const draggables = [
    {
      image: "/images/draggable/2.jpg",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      image: "/images/draggable/7.jpg",
      className: "absolute top-20 left-[40%] rotate-[10deg]",
    },
    {
      image: "/images/draggable/8.jpg",
      className: "absolute top-30 left-[30%] rotate-[2deg]",
    },
    {
      image: "/images/draggable/6.jpg",
      className: "absolute top-32 left-[20%] rotate-[-8deg]",
    },
    {
      image: "/images/draggable/3.jpg",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      image: "/images/draggable/1.jpg",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      image: "/images/draggable/4.jpg",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      image: "/images/draggable/5.jpg",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    }
  ];

  const slideData = [
    {
      title: "Music Trophy Winners",
      src: "/images/carousel/music_2024.jpg",
    },
    {
      title: "Winners of Photo Story",
      src: "/images/carousel/photostory_2024.jpg",
    },
    {
      title: "Winners of CAIC GC 2024",
      src: "/images/carousel/tech_gc_2024.jpg",
    },
    {
      title: "Winners of Wall Painting",
      src: "/images/draggable/5.jpg",
    },
    {
      title: "2nd runner-up in Street Play",
      src: "/images/carousel/streetplay_2024.jpg",
    },
    {
      title: "4th in Mime monoact",
      src: "/images/carousel/mime_2024.jpg",
    },
  ];

  const credits = [
    {
      id: 1,
      name: "Arnav Choudhary",
      designation: "Developer",
      image: "/images/credits/arnav.jpg",
    },
    {
      id: 2,
      name: "Akshit Jain",
      designation: "Designer",
      image: "/images/credits/akshit.jpg",
    },
    {
      id: 3,
      name: "Ritul Kumawat",
      designation: "Supervisor",
      image: "/images/credits/ritul.jpeg",
    }
  ];

  const nextSectionRef = useRef<HTMLDivElement>(null);

  const handleNextPage = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-black dark">
      <div className="h-screen snap-start relative">
        <ImagesSlider className="h-screen" images={images}>
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
          >
            <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              Girnar <br /> Best hostel in IIT Delhi
            </motion.p>
            <motion.div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
              <Link href="/auth/login">
                <button className="transform rounded-full bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="transform rounded-full border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-transparent backdrop-blur-sm dark:text-white dark:hover:backdrop-blur-3xl">
                  Sign Up
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </ImagesSlider>
        <button
          onClick={handleNextPage}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 shadow-lg backdrop-blur-md transition-all duration-200"
          aria-label="Go to next section"
        >
          <ChevronDown size={32} />
        </button>
      </div>

      <div ref={nextSectionRef} className="flex flex-col w-full min-h-screen h-screen snap-start">
        <h1
          className="text-4xl font-bold mt-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
        >
          Our Movements
        </h1>

        <p className="hidden md:block mt-2 text-center text-lg bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Drag to see magic unfold
        </p>

        <DraggableCardContainer className="relative mt-8 flex w-full items-center justify-center overflow-x-clip">
          {draggables.map((item, index) => (
            <DraggableCardBody key={item.image + index} className={item.className}>
              <Image
                alt={`Draggable item ${index}`}
                src={item.image}
                width={500}
                height={500}
                className="pointer-events-none relative z-10 md:h-80 md:w-80 h-50 w-50 object-cover"
              />
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>

      <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen snap-start">
        <h1 className="text-4xl font-bold my-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          We Rule
        </h1>
        <div className="relative content-center overflow-hidden pb-32 w-full h-full">
          <Carousel slides={slideData} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full min-h-screen h-screen snap-start">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Credits
            <div className="flex flex-row items-center justify-center mt-12 w-full">
              <AnimatedTooltip items={credits} />
            </div>

          </motion.h1>
        </LampContainer>
      </div>
    </div>
  );
}

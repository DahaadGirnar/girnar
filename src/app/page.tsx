"use client";

import { useRef } from "react";

import Hero from "@/components/homepage/hero";
import DraggableImages from "@/components/homepage/draggable-images";
import Winnings from "@/components/homepage/winnings";
import Reps from "@/components/homepage/reps";
import Credits from "@/components/homepage/credits";

export default function Home() { 
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const handleNextPage = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory bg-black dark">
      <Hero handleNextPage={handleNextPage} />
      <DraggableImages nextSectionRef={nextSectionRef} />
      <Winnings />
      <Reps />
      <Credits />
    </div>
  );
}

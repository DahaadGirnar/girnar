import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import Image from "next/image";

export default function DraggableImages(
  { nextSectionRef }: {
    nextSectionRef: React.RefObject<HTMLDivElement | null>;
  }) {
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

  return (
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
  );
}

import { useRef, useState } from "react";
import Carousel from "@/components/ui/carousel";

const CardContent = (
  { name, number }: {
    name: string;
    number: string;
  }) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleCopyNumber = () => {
    // Try clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(number);
    } else if (inputRef.current) {
      // Fallback for mobile browsers
      inputRef.current.value = number;
      inputRef.current.style.display = "block";
      inputRef.current.select();
      document.execCommand("copy");
      inputRef.current.style.display = "none";
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">{name}</h1>
      <p>
        {/* Hidden input for mobile copy fallback */}
        <input
          ref={inputRef}
          type="text"
          readOnly
          tabIndex={-1}
          style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, pointerEvents: "none" }}
          aria-hidden="true"
        />
        {!copied && (
          <button
            onClick={handleCopyNumber}
            className="bg-transparent border-none cursor-pointer text-lg font-medium text-white hover:underline focus:outline-none relative"
            style={{ outline: "none" }}
            aria-label="Copy caretaker number"
          >
            {number}
          </button>
        )}
        {copied && (
          <span className="px-2 py-1 rounded-full border border-black bg-transparent text-white animate-fade-in">
            Number Copied
          </span>
        )}
      </p>
    </div>
  )
}

export default function Reps() {
  const slideData = [
    {
      title: "Secretary to SAC",
      src: "/images/secy_reps/sac_2024.jpg",
      content: <CardContent name={"Arnav Wadwa"} number={"+91 85477 29179"} />,
    },
    {
      title: "Tech Secretary",
      src: "/images/secy_reps/tech_2024.jpg",
      content: <CardContent name={"Aryan Tandon"} number={"+91 79754 92197"} />,
    },
    {
      title: "Representative to BSW",
      src: "/images/secy_reps/bsw1_2024.jpg",
      content: <CardContent name={"Aditya Pandey"} number={"+91 98936 32386"} />,
    },
    {
      title: "Representative to BSW",
      src: "/images/secy_reps/bsw2_2024.jpg",
      content: <CardContent name={"Arnav Choudhary"} number={"+91 94613 76136"} />,
    },
    {
      title: "Literary Representative",
      src: "/images/secy_reps/lit_2024.jpg",
      content: <CardContent name={"Pragun"} number={"+91 82797 54052"} />,
    },
    {
      title: "Drama Representative",
      src: "/images/secy_reps/drama_2024.jpg",
      content: <CardContent name={"Yash Gaur"} number={"+91 72530 19168"} />,
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen h-screen snap-start">
      <h1 className="text-4xl font-bold mt-8 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
        Our Heroes
      </h1>
      <div className="relative content-center overflow-hidden pb-32 w-full h-full">
        <Carousel slides={slideData} />
      </div>
    </div>
  );
}

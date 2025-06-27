import { motion } from "motion/react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { LampContainer } from "@/components/ui/lamp";
import { FaInstagram, FaMapMarked } from "react-icons/fa";
import { useRef, useState } from "react";
import Link from "next/link";

export default function Credits() {
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
  
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopyNumber = () => {
    const number = "+91 92129 15558";
    // Try clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(number).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } else if (inputRef.current) {
      // Fallback for mobile browsers
      inputRef.current.value = number;
      inputRef.current.style.display = "block";
      inputRef.current.select();
      document.execCommand("copy");
      inputRef.current.style.display = "none";
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex h-screen w-full snap-start">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Credits
        </motion.h1>

        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex mt-12 flex-row items-center justify-center w-full"
        >
          <AnimatedTooltip items={credits} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex mt-8 flex-row gap-2 items-center justify-center w-full"
        >
          <Link
            href="https://www.instagram.com/dahaad_girnar" target="_blank"
            arial-label="Instagram"
            className="transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-110"
          >
            <FaInstagram size={32} color="#E4405F" />
          </Link>
          <Link
            href="https://www.google.com/maps/dir//G5XQ%2B5GR+Jia+Sarai,+Gamal+Abdel+Nasser+Marg,+Deer+Park,+Hauz+Khas,+New+Delhi,+Delhi+110016/@28.5479737,77.1063783,25821m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x390d1d0c62761735:0x8d39d61fd016e555!2m2!1d77.1887797!2d28.5479986?entry=ttu&g_ep=EgoyMDI1MDYyMi4wIKXMDSoASAFQAw%3D%3D" target="_blank"
            className="transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-110"
          >
            <FaMapMarked size={32} color="#34A853" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex mt-4 flex-col items-center justify-center w-full"
        >
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
              Caretaker: +91 92129 15558
            </button>
          )}
          {copied && (
            <span className="ml-2 px-2 py-1 rounded bg-green-600 text-white text-sm animate-fade-in">
              Number Copied
            </span>
          )}
        </motion.div>
      </LampContainer>
    </div>
  );
}
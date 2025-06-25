import { motion } from "motion/react";
import { ImagesSlider } from "@/components/ui/images-slider";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Hero({ handleNextPage }: { handleNextPage: () => void }) {
  const images = [
    "/images/hero/2.jpg",
    "/images/hero/3.jpg",
    "/images/hero/1.jpg",
    "/images/hero/4.jpg",
  ];

  return (
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
  )
}

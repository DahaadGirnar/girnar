import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

export default function Credit() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full min-h-screen">
      <AnimatedTooltip items={[
        {
          id: 1,
          name: "Arnav Choudhary",
          designation: "Developer",
          image:
            "/images/arnav.jpg",
        },
        {
          id: 2,
          name: "Akshit Jain",
          designation: "Designer",
          image:
            "/images/akshit.jpg",
        }
      ]} />
    </div>
  );
}

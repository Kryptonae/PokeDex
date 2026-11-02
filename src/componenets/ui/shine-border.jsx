import { motion } from "framer-motion";

function ShineBorder({
  shineColor = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] border-2"
      initial={{ opacity: 0, borderColor: shineColor[0] }}
      animate={{
        opacity: 1,
        borderColor: shineColor,
        boxShadow: [
          `0 0 8px ${shineColor[0]}40`,
          `0 0 14px ${shineColor[1]}55`,
          `0 0 8px ${shineColor[2]}40`,
        ],
      }}
      transition={{
        opacity: { duration: 0.2 },
        borderColor: { duration: 2.5, repeat: Infinity },
        boxShadow: { duration: 2.5, repeat: Infinity },
      }}
    />
  );
}

export { ShineBorder };

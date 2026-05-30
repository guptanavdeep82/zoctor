import { motion } from "framer-motion";

const moodConfig = {
  happy: { emoji: "😊", label: "Happy child doctor", badge: "bg-emerald-100 text-emerald-600" },
  talking: { emoji: "💬", label: "Talking child doctor", badge: "bg-sky-100 text-care-blue" },
  concerned: { emoji: "😟", label: "Concerned child doctor", badge: "bg-amber-100 text-amber-600" },
  emergency: { emoji: "🚨", label: "Emergency child doctor", badge: "bg-red-100 text-red-600" },
};

export function DoctorAvatar({ size = "lg", mood = "happy", animated = true }) {
  const dimensions = size === "sm" ? "h-16 w-24" : size === "md" ? "h-28 w-40" : "h-48 w-72";
  const config = moodConfig[mood] || moodConfig.happy;

  return (
    <motion.div
      className={`${dimensions} avatar-float relative mx-auto`}
      animate={animated ? { y: [0, -6, 0], rotate: [0, -0.7, 0.7, 0] } : undefined}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      aria-label={config.label}
      role="img"
    >
      <div className="h-full w-full overflow-hidden rounded-[1.6rem] bg-white p-1 shadow-xl shadow-sky-200/70">
        <img
          src="/doctor-avatar-reference.png"
          alt={config.label}
          className="h-full w-full rounded-[1.35rem] object-cover"
          draggable="false"
        />
      </div>

      <span
        className={`absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full border-2 border-white text-lg shadow-lg ${config.badge}`}
      >
        {config.emoji}
      </span>
    </motion.div>
  );
}

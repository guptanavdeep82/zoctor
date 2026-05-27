import { motion } from "framer-motion";

export function DoctorAvatar({ size = "lg", mood = "happy", animated = true }) {
  const dimensions = size === "sm" ? "h-14 w-14" : size === "md" ? "h-24 w-24" : "h-44 w-44";
  const face = mood === "concerned" ? "after:content-['o']" : "after:content-[')']";

  return (
    <motion.div
      className={`${dimensions} avatar-float relative mx-auto rounded-[2rem] bg-gradient-to-b from-sky-100 to-white p-2 shadow-xl shadow-sky-200/70`}
      animate={animated ? { rotate: [0, -1.5, 1.5, 0] } : undefined}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Animated doctor avatar"
      role="img"
    >
      <div className="cloud-card relative h-full w-full overflow-hidden rounded-[1.6rem] border border-white/80">
        <div className="absolute left-1/2 top-[14%] h-[52%] w-[58%] -translate-x-1/2 rounded-full bg-[#ffd6ad] shadow-inner">
          <span className="absolute left-[24%] top-[42%] h-3 w-3 rounded-full bg-sky-950" />
          <span className="absolute right-[24%] top-[42%] h-3 w-3 rounded-full bg-sky-950" />
          <span
            className={`absolute left-1/2 top-[57%] -translate-x-1/2 text-2xl font-bold leading-none text-rose-500 ${face}`}
          />
          <span className="absolute left-[12%] top-[50%] h-3 w-3 rounded-full bg-rose-300/70" />
          <span className="absolute right-[12%] top-[50%] h-3 w-3 rounded-full bg-rose-300/70" />
        </div>
        <div className="absolute left-1/2 top-[10%] h-[22%] w-[64%] -translate-x-1/2 rounded-t-full bg-[#243d73]" />
        <div className="absolute left-1/2 top-[4%] h-[34%] w-[16%] -translate-x-1/2 rounded-full border-4 border-[#243d73] bg-white">
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-care-blue" />
        </div>
        <div className="absolute bottom-[-7%] left-1/2 h-[42%] w-[76%] -translate-x-1/2 rounded-t-[2rem] bg-white">
          <div className="mx-auto h-full w-[32%] bg-care-blue" />
          <span className="absolute left-[20%] top-[16%] h-[46%] w-1 rounded-full bg-sky-800" />
          <span className="absolute right-[20%] top-[16%] h-[46%] w-1 rounded-full bg-sky-800" />
        </div>
      </div>
    </motion.div>
  );
}

"use client"

import { motion } from "framer-motion"

export function DecorativeBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-3xl" />

      {/* Decorative elements */}
      <motion.div
        className="decorative-dots absolute top-[10%] right-[5%] opacity-30"
        animate={{
          rotate: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="decorative-circle absolute bottom-[15%] left-[10%] w-[300px] h-[300px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="decorative-circle absolute top-[30%] left-[20%] w-[150px] h-[150px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />

      {/* Additional decorative elements for intro screen */}
      <motion.div
        className="absolute top-[20%] right-[20%] w-[200px] h-[200px] rounded-full bg-primary/5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-[30%] right-[15%] w-[150px] h-[150px] rounded-full bg-primary/5"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 3,
        }}
      />
    </div>
  )
}


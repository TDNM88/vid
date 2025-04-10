"use client"

import { useState, useEffect } from "react"
import { VideoGenerator } from "@/components/video-generator"
import { DecorativeBackground } from "@/components/ui-custom/decorative-background"
import { IntroScreen } from "@/components/intro-screen"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)

  // Check if user has seen intro before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro")
    if (hasSeenIntro === "true") {
      setShowIntro(false)
      setHasSeenIntro(true)
    }
  }, [])

  const handleStartApp = () => {
    setShowIntro(false)
    // Save to localStorage so user doesn't see intro again
    localStorage.setItem("hasSeenIntro", "true")
    setHasSeenIntro(true)
  }

  return (
    <main className="min-h-screen pb-20">
      <DecorativeBackground />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <IntroScreen onStart={handleStartApp} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="container mx-auto py-8 md:py-12 px-4">
              <motion.div
                className="text-center mb-8 md:mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 gradient-heading responsive-text-xl">
                  Tạo Video Mạng Xã Hội
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto responsive-text-base">
                  Tạo video chuyên nghiệp cho mạng xã hội chỉ trong vài phút với công nghệ AI tiên tiến
                </p>
              </motion.div>

              <VideoGenerator />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}


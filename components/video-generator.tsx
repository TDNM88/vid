"use client"

import { useState, useEffect } from "react"
import { ScriptGenerator } from "./steps/script-generator"
import { ImageGenerator } from "./steps/image-generator"
import { VoiceGenerator } from "./steps/voice-generator"
import { VideoAssembler } from "./steps/video-assembler"
import { FinalOutput } from "./steps/final-output"
import { StepIndicator } from "./step-indicator"
import { GlassCard } from "./ui-custom/glass-card"
import { AnimatePresence, motion } from "framer-motion"

type Step = 1 | 2 | 3 | 4 | 5

export type Script = {
  title: string
  segments: {
    script: string
    image_description: string
    image_path?: string
    audio_path?: string
    direct_image_url?: string
  }[]
  video_path?: string
  thumbnail_path?: string
}

export type SessionData = {
  session_id: string
  script: Script
}

export function VideoGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress based on current step
    const newProgress = ((currentStep - 1) / 4) * 100
    setProgress(newProgress)
  }, [currentStep])

  const goToNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <StepIndicator currentStep={currentStep} progress={progress} />

      <GlassCard className="transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <ScriptGenerator
                onNext={goToNextStep}
                setSessionData={setSessionData}
                sessionData={sessionData}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && sessionData && (
              <ImageGenerator
                onNext={goToNextStep}
                onPrevious={goToPreviousStep}
                sessionData={sessionData}
                setSessionData={setSessionData}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && sessionData && (
              <VoiceGenerator
                onNext={goToNextStep}
                onPrevious={goToPreviousStep}
                sessionData={sessionData}
                setSessionData={setSessionData}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}

            {currentStep === 4 && sessionData && (
              <VideoAssembler
                onNext={goToNextStep}
                onPrevious={goToPreviousStep}
                sessionData={sessionData}
                set
                onPrevious={goToPreviousStep}
                sessionData={sessionData}
                setSessionData={setSessionData}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}

            {currentStep === 5 && sessionData && (
              <FinalOutput
                onPrevious={goToPreviousStep}
                sessionData={sessionData}
                setSessionData={setSessionData}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </GlassCard>
    </div>
  )
}


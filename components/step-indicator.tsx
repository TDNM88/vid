"use client"

import { CheckIcon } from "lucide-react"
import { motion } from "framer-motion"

type StepIndicatorProps = {
  currentStep: number
  progress: number
}

export function StepIndicator({ currentStep, progress }: StepIndicatorProps) {
  const steps = [
    { id: 1, name: "Kịch bản" },
    { id: 2, name: "Hình ảnh" },
    { id: 3, name: "Giọng đọc" },
    { id: 4, name: "Tạo video" },
    { id: 5, name: "Kết quả" },
  ]

  return (
    <div className="relative mb-12">
      <div className="steps-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />

        {steps.map((step) => (
          <motion.div
            key={step.id}
            className={`step-item ${currentStep === step.id ? "active" : currentStep > step.id ? "complete" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: step.id * 0.1,
              ease: "easeOut",
            }}
          >
            <motion.div className="step-circle" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {currentStep > step.id ? <CheckIcon className="h-4 w-4" /> : step.id}
            </motion.div>
            <span className="step-text">{step.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


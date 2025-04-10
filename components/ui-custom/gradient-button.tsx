"use client"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface GradientButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
}

export function GradientButton({ children, className, isLoading, loadingText, ...props }: GradientButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={cn("btn-gradient text-white font-medium rounded-xl py-5 md:py-6 h-auto", className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{loadingText || "Đang xử lý..."}</span>
          </>
        ) : (
          <span>{children}</span>
        )}
      </Button>
    </motion.div>
  )
}


"use client"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { motion } from "framer-motion"

export function OutlineButton({ children, className, ...props }: ButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        className={cn("btn-outline rounded-xl py-5 md:py-6 h-auto font-medium", className)}
        {...props}
      >
        <span>{children}</span>
      </Button>
    </motion.div>
  )
}


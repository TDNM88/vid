"use client"

import type { Script } from "../video-generator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

type ScriptEditorProps = {
  script: Script
}

export function ScriptEditor({ script }: ScriptEditorProps) {
  return (
    <div className="space-y-4">
      <motion.h3
        className="text-xl md:text-2xl font-semibold gradient-heading"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {script.title}
      </motion.h3>

      <Accordion type="single" collapsible className="w-full">
        {script.segments.map((segment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="custom-accordion-item"
          >
            <AccordionItem value={`segment-${index}`} className="border-0">
              <AccordionTrigger className="custom-accordion-trigger">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium">Phân đoạn {index + 1}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="custom-accordion-content">
                <div className="rounded-xl bg-white/50 p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Nội dung lời thoại:</h4>
                    <p className="text-gray-700">{segment.script}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Mô tả hình ảnh:</h4>
                    <p className="text-gray-700">{segment.image_description}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  )
}


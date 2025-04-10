"use client"

import { useState } from "react"
import type { SessionData } from "../video-generator"
import { Download, ImageIcon, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { GradientButton } from "../ui-custom/gradient-button"
import { OutlineButton } from "../ui-custom/outline-button"
import { motion } from "framer-motion"

type FinalOutputProps = {
  onPrevious: () => void
  sessionData: SessionData
  setSessionData: (data: SessionData) => void
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

export function FinalOutput({ onPrevious, sessionData, setSessionData, setIsLoading, isLoading }: FinalOutputProps) {
  const [thumbnailPrompt, setThumbnailPrompt] = useState("")
  const [thumbnailPath, setThumbnailPath] = useState(sessionData.script.thumbnail_path || "")
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleGenerateThumbnail = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: sessionData.script,
          prompt: thumbnailPrompt,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setThumbnailPath(data.thumbnail_path)
        setSessionData({
          ...sessionData,
          script: data.script,
        })
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error("Error generating thumbnail:", error)
      alert("Đã xảy ra lỗi khi tạo ảnh bìa")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadVideo = () => {
    if (sessionData.script.video_path) {
      const link = document.createElement("a")
      link.href = sessionData.script.video_path
      link.download = `video_${sessionData.session_id}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setIsDownloaded(true)

      // Reset the downloaded state after 3 seconds
      setTimeout(() => {
        setIsDownloaded(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-heading flex items-center">
          <CheckCircle className="h-6 w-6 mr-2 text-primary" />
          Bước 5: Kết quả
        </h2>
        <p className="text-gray-600">Video của bạn đã sẵn sàng để tải xuống</p>
      </div>

      <div className="space-y-8">
        <motion.div
          className="rounded-xl overflow-hidden glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 md:p-6 space-y-4">
            <h3 className="text-xl font-semibold gradient-heading">{sessionData.script.title}</h3>

            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                src={sessionData.script.video_path}
                controls
                className="w-full h-full"
                poster={thumbnailPath || "/placeholder.svg?height=720&width=1280"}
              />
            </div>

            <GradientButton onClick={handleDownloadVideo} className="w-full" disabled={!sessionData.script.video_path}>
              {isDownloaded ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Đã tải xuống</span>
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Tải xuống video</span>
                </>
              )}
            </GradientButton>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl overflow-hidden glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-4 md:p-6 space-y-4">
            <h3 className="font-semibold gradient-heading flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Tạo ảnh bìa
            </h3>

            <div className="space-y-2">
              <Label htmlFor="thumbnail-prompt" className="text-sm font-medium">
                Mô tả ảnh bìa
              </Label>
              <Textarea
                id="thumbnail-prompt"
                placeholder="Mô tả ảnh bìa bạn muốn tạo (ví dụ: Ảnh bìa video với tiêu đề nổi bật và hình ảnh...)"
                value={thumbnailPrompt}
                onChange={(e) => setThumbnailPrompt(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary resize-none input-focus-ring"
                rows={3}
              />
            </div>

            <GradientButton
              onClick={handleGenerateThumbnail}
              className="w-full"
              disabled={isLoading || !thumbnailPrompt}
              isLoading={isLoading}
              loadingText="Đang tạo ảnh bìa..."
            >
              Tạo ảnh bìa
            </GradientButton>

            {thumbnailPath && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium text-primary mb-2">Ảnh bìa</h4>
                <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden image-container shadow-md">
                  <img src={thumbnailPath || "/placeholder.svg"} alt="Ảnh bìa" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between pt-4">
        <OutlineButton onClick={onPrevious}>Quay lại</OutlineButton>
        <GradientButton variant="outline" onClick={() => window.location.reload()}>
          Tạo video mới
        </GradientButton>
      </div>
    </div>
  )
}


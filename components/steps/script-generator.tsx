"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SessionData, Script } from "../video-generator"
import { ScriptEditor } from "./script-editor"
import { GradientButton } from "../ui-custom/gradient-button"
import { OutlineButton } from "../ui-custom/outline-button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

type ScriptGeneratorProps = {
  onNext: () => void
  setSessionData: (data: SessionData) => void
  sessionData: SessionData | null
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

export function ScriptGenerator({
  onNext,
  setSessionData,
  sessionData,
  setIsLoading,
  isLoading,
}: ScriptGeneratorProps) {
  const [subject, setSubject] = useState("")
  const [summary, setSummary] = useState("")
  const [duration, setDuration] = useState("1-2 phút")
  const [platform, setPlatform] = useState("Facebook")
  const [script, setScript] = useState<Script | null>(sessionData?.script || null)
  const [feedback, setFeedback] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleGenerateScript = async () => {
    if (!subject || !summary) {
      alert("Vui lòng nhập chủ đề và tóm tắt nội dung")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          summary,
          duration,
          platform,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setScript(data.script)
        setSessionData({
          session_id: data.session_id,
          script: data.script,
        })
        setIsEditing(true)
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error("Error generating script:", error)
      alert("Đã xảy ra lỗi khi tạo kịch bản")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateScript = async () => {
    if (!sessionData) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/update-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: sessionData.script,
          feedback,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setScript(data.script)
        setSessionData({
          ...sessionData,
          script: data.script,
        })
        setFeedback("")
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error("Error updating script:", error)
      alert("Đã xảy ra lỗi khi cập nhật kịch bản")
    } finally {
      setIsLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-heading flex items-center">
          <Sparkles className="h-6 w-6 mr-2 text-primary" />
          Bước 1: Tạo kịch bản
        </h2>
        <p className="text-gray-600">Nhập thông tin để tạo kịch bản cho video của bạn</p>
      </div>

      {!isEditing ? (
        <motion.div className="space-y-6" variants={formVariants} initial="hidden" animate="visible">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" variants={itemVariants}>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Chủ đề
              </Label>
              <Input
                id="subject"
                placeholder="Nhập chủ đề video"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">
                Nền tảng
              </Label>
              <Select value={platform} onValueChange={(value) => setPlatform(value)}>
                <SelectTrigger className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring">
                  <SelectValue placeholder="Chọn nền tảng" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium">
              Tóm tắt nội dung
            </Label>
            <Textarea
              id="summary"
              placeholder="Mô tả nội dung bạn muốn thực hiện"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary resize-none input-focus-ring"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Độ dài video
            </Label>
            <Select value={duration} onValueChange={(value) => setDuration(value)}>
              <SelectTrigger
                id="duration"
                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring"
              >
                <SelectValue placeholder="Chọn độ dài" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Dưới 1 phút">Dưới 1 phút</SelectItem>
                <SelectItem value="1-2 phút">1-2 phút</SelectItem>
                <SelectItem value="2-3 phút">2-3 phút</SelectItem>
                <SelectItem value="3-5 phút">3-5 phút</SelectItem>
                <SelectItem value="Trên 5 phút">Trên 5 phút</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GradientButton
              onClick={handleGenerateScript}
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Đang tạo kịch bản với Llama 4..."
            >
              Tạo kịch bản
            </GradientButton>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {script && <ScriptEditor script={script} />}

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Phản hồi chỉnh sửa
            </Label>
            <Textarea
              id="feedback"
              placeholder="Nhập phản hồi để chỉnh sửa kịch bản (ví dụ: Thêm chi tiết về..., Rút ngắn phần...)"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary resize-none input-focus-ring"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <OutlineButton onClick={() => setIsEditing(false)} className="flex-1">
              Quay lại
            </OutlineButton>
            <GradientButton
              onClick={handleUpdateScript}
              className="flex-1"
              disabled={!feedback || isLoading}
              isLoading={isLoading}
              loadingText="Đang cập nhật..."
            >
              Cập nhật kịch bản
            </GradientButton>
            <GradientButton onClick={onNext} className="flex-1">
              Tiếp tục
            </GradientButton>
          </div>
        </motion.div>
      )}
    </div>
  )
}


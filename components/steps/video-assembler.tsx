"use client"

import { useState, useEffect } from "react"
import type { SessionData } from "../video-generator"
import { Music, Video } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GradientButton } from "../ui-custom/gradient-button"
import { OutlineButton } from "../ui-custom/outline-button"
import { motion } from "framer-motion"

type MusicFile = {
  filename: string
  path: string
}

type VideoAssemblerProps = {
  onNext: () => void
  onPrevious: () => void
  sessionData: SessionData
  setSessionData: (data: SessionData) => void
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

export function VideoAssembler({
  onNext,
  onPrevious,
  sessionData,
  setSessionData,
  setIsLoading,
  isLoading,
}: VideoAssemblerProps) {
  const [backgroundMusic, setBackgroundMusic] = useState("")
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([])
  const [videoPath, setVideoPath] = useState("")
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Fetch available music files
    const fetchMusicFiles = async () => {
      try {
        const response = await fetch("/api/music")
        const data = await response.json()
        setMusicFiles(data.music_files || [])
      } catch (error) {
        console.error("Error fetching music files:", error)
      }
    }

    fetchMusicFiles()

    // Cleanup audio on unmount
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [])

  const handleCreateVideo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: sessionData.script,
          background_music: backgroundMusic,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setVideoPath(data.video_path)
        setSessionData({
          ...sessionData,
          script: data.script,
        })
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating video:", error)
      alert("Đã xảy ra lỗi khi tạo video")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayMusic = (path: string) => {
    if (audioElement) {
      audioElement.pause()
      if (isPlaying && audioElement.src.endsWith(path.split("/").pop() || "")) {
        setIsPlaying(false)
        return
      }
    }

    const audio = new Audio(path)
    audio.volume = 0.2 // 20% volume
    audio.loop = true
    audio.play()
    setAudioElement(audio)
    setIsPlaying(true)
  }

  const handleStopMusic = () => {
    if (audioElement) {
      audioElement.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-heading flex items-center">
          <Video className="h-6 w-6 mr-2 text-primary" />
          Bước 4: Tạo video
        </h2>
        <p className="text-gray-600">Ghép hình ảnh và giọng đọc thành video hoàn chỉnh</p>
      </div>

      <div className="space-y-6">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Label htmlFor="background-music" className="text-sm font-medium">
            Nhạc nền (tùy chọn)
          </Label>
          <Select
            value={backgroundMusic}
            onValueChange={(value) => {
              setBackgroundMusic(value)
              if (value && value !== "none") {
                handlePlayMusic(`/static/music/${value}`)
              } else {
                handleStopMusic()
              }
            }}
          >
            <SelectTrigger
              id="background-music"
              className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring"
            >
              <SelectValue placeholder="Chọn nhạc nền" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="none">Không sử dụng nhạc nền</SelectItem>
              {musicFiles.map((file) => (
                <SelectItem key={file.filename} value={file.filename}>
                  {file.filename.replace(/\.(mp3|wav)$/i, "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {musicFiles.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {musicFiles.map((file, index) => (
              <motion.div
                key={file.filename}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`rounded-xl p-3 flex items-center space-x-2 cursor-pointer card-hover ${
                    backgroundMusic === file.filename ? "bg-primary/10 text-primary" : "bg-white/50 text-gray-700"
                  }`}
                  onClick={() => {
                    setBackgroundMusic(file.filename)
                    handlePlayMusic(file.path)
                  }}
                >
                  <Music
                    className={`h-5 w-5 ${backgroundMusic === file.filename ? "text-primary" : "text-gray-400"}`}
                  />
                  <span className="text-sm truncate font-medium">{file.filename.replace(/\.(mp3|wav)$/i, "")}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <GradientButton
          onClick={handleCreateVideo}
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
          loadingText="Đang tạo video..."
        >
          Tạo video
        </GradientButton>

        {videoPath && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-medium text-primary">Xem trước video</h3>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <video
                src={videoPath}
                controls
                className="w-full h-full"
                poster="/placeholder.svg?height=720&width=1280"
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <OutlineButton onClick={onPrevious}>Quay lại</OutlineButton>
        <GradientButton onClick={onNext} disabled={!videoPath}>
          Tiếp tục
        </GradientButton>
      </div>
    </div>
  )
}


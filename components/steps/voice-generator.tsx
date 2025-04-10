"use client"

import { useState, useEffect } from "react"
import type { SessionData } from "../video-generator"
import { Play, Square, RefreshCw, Mic } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientButton } from "../ui-custom/gradient-button"
import { OutlineButton } from "../ui-custom/outline-button"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type Voice = {
  ShortName: string
  FriendlyName: string
}

type VoiceGeneratorProps = {
  onNext: () => void
  onPrevious: () => void
  sessionData: SessionData
  setSessionData: (data: SessionData) => void
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

export function VoiceGenerator({
  onNext,
  onPrevious,
  sessionData,
  setSessionData,
  setIsLoading,
  isLoading,
}: VoiceGeneratorProps) {
  const [ttsService, setTtsService] = useState("edge_tts")
  const [voice, setVoice] = useState("")
  const [voices, setVoices] = useState<{
    edge_tts: {
      vietnamese: Voice[]
      english: Voice[]
      other: Voice[]
    }
    openai: Voice[]
  } | null>(null)
  const [audioResults, setAudioResults] = useState<{ segment: number; text: string; path: string }[]>([])
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Fetch available voices
    const fetchVoices = async () => {
      try {
        const response = await fetch("/api/voices")
        const data = await response.json()
        if (data.success) {
          setVoices(data.voices)

          // Set default voice if available
          if (data.voices?.edge_tts?.vietnamese?.length > 0) {
            setVoice(data.voices.edge_tts.vietnamese[0].ShortName)
          } else if (data.voices?.openai?.length > 0) {
            setVoice(data.voices.openai[0].ShortName)
          }
        } else {
          console.error("Error fetching voices:", data.error)
        }
      } catch (error) {
        console.error("Error fetching voices:", error)
      }
    }

    fetchVoices()

    // Cleanup audio on unmount
    return () => {
      if (audioElement) {
        audioElement.pause()
        audioElement.src = ""
      }
    }
  }, [])

  const handleGenerateAudio = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: sessionData.script,
          tts_service: ttsService,
          voice: voice,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAudioResults(data.audio)
        setSessionData({
          ...sessionData,
          script: data.script,
        })
      } else {
        alert(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      console.error("Error generating audio:", error)
      alert("Đã xảy ra lỗi khi tạo giọng đọc")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayAudio = (segment: number, path: string) => {
    if (audioElement) {
      audioElement.pause()
    }

    if (playingAudio === segment) {
      setPlayingAudio(null)
      return
    }

    const audio = new Audio(path)
    audio.onended = () => {
      setPlayingAudio(null)
    }
    audio.play()
    setAudioElement(audio)
    setPlayingAudio(segment)
  }

  const handleRegenerateAudio = async (segment: number) => {
    // In a real implementation, this would regenerate just one segment's audio
    alert(`Chức năng tạo lại giọng đọc cho phân đoạn ${segment} sẽ được triển khai sau`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-heading flex items-center">
          <Mic className="h-6 w-6 mr-2 text-primary" />
          Bước 3: Tạo giọng đọc
        </h2>
        <p className="text-gray-600">Tạo giọng đọc cho từng phân đoạn trong kịch bản</p>
      </div>

      <div className="space-y-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="tts-service" className="text-sm font-medium">
              Dịch vụ TTS
            </Label>
            <Select value={ttsService} onValueChange={(value) => setTtsService(value)}>
              <SelectTrigger
                id="tts-service"
                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring"
              >
                <SelectValue placeholder="Chọn dịch vụ TTS" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="edge_tts">Microsoft Edge TTS</SelectItem>
                <SelectItem value="openai">OpenAI TTS</SelectItem>
                <SelectItem value="vixtts">viXTTS</SelectItem>
                <SelectItem value="auto">Tự động (Thử tất cả)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice" className="text-sm font-medium">
              Giọng đọc
            </Label>
            <Select value={voice} onValueChange={(value) => setVoice(value)}>
              <SelectTrigger
                id="voice"
                className="rounded-xl border-gray-200 focus:border-primary focus:ring-primary h-12 input-focus-ring"
              >
                <SelectValue placeholder="Chọn giọng đọc" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-xl">
                {ttsService === "edge_tts" && voices?.edge_tts ? (
                  <>
                    <SelectItem value="vi-group" disabled>
                      Tiếng Việt
                    </SelectItem>
                    {voices.edge_tts.vietnamese.map((v) => (
                      <SelectItem key={v.ShortName} value={v.ShortName}>
                        {v.FriendlyName || v.ShortName}
                      </SelectItem>
                    ))}
                    <SelectItem value="en-group" disabled>
                      Tiếng Anh
                    </SelectItem>
                    {voices.edge_tts.english.map((v) => (
                      <SelectItem key={v.ShortName} value={v.ShortName}>
                        {v.FriendlyName || v.ShortName}
                      </SelectItem>
                    ))}
                  </>
                ) : ttsService === "openai" && voices?.openai ? (
                  voices.openai.map((v) => (
                    <SelectItem key={v.ShortName} value={v.ShortName}>
                      {v.FriendlyName || v.ShortName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Không có giọng đọc khả dụng
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <GradientButton
          onClick={handleGenerateAudio}
          className="w-full"
          disabled={isLoading || !voice}
          isLoading={isLoading}
          loadingText="Đang tạo giọng đọc..."
        >
          Tạo giọng đọc cho tất cả phân đoạn
        </GradientButton>

        {audioResults.length > 0 && (
          <Tabs defaultValue="audio" className="w-full">
            <TabsList className="custom-tabs-list">
              <TabsTrigger value="audio" className="custom-tab">
                Giọng đọc
              </TabsTrigger>
            </TabsList>
            <TabsContent value="audio" className="space-y-4">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {audioResults.map((result, index) => (
                  <motion.div
                    key={result.segment}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="rounded-xl bg-white/50 p-4 flex items-center justify-between card-hover">
                      <div className="flex-1 mr-4">
                        <h3 className="font-medium text-primary">Phân đoạn {result.segment}</h3>
                        <p className="text-sm text-gray-700 line-clamp-2 mt-1">{result.text}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-10 h-10"
                          onClick={() => handlePlayAudio(result.segment, result.path)}
                        >
                          {playingAudio === result.segment ? (
                            <Square className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-10 h-10"
                          onClick={() => handleRegenerateAudio(result.segment)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <OutlineButton onClick={onPrevious}>Quay lại</OutlineButton>
        <GradientButton onClick={onNext} disabled={audioResults.length === 0}>
          Tiếp tục
        </GradientButton>
      </div>
    </div>
  )
}


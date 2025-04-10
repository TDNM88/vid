"use client"

import { useState } from "react"
import type { SessionData as VideoGeneratorSessionData } from "../video-generator"
import { RefreshCw, ImageIcon } from "lucide-react"
import { ScriptEditor } from "./script-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradientButton } from "../ui-custom/gradient-button"
import { OutlineButton } from "../ui-custom/outline-button"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"

type ImageGeneratorProps = {
  onNext: () => void
  onPrevious: () => void
  sessionData: SessionData
  setSessionData: (data: SessionData) => void
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

type Segment = {
  script: string
  prompt?: string
  image_path?: string
  direct_image_url?: string
  image_description?: string
  audio_path?: string
}

type Script = {
  title: string
  segments: Segment[]
}

type SessionData = VideoGeneratorSessionData & {
  script: Script
}

export function ImageGenerator({
  onNext,
  onPrevious,
  sessionData,
  setSessionData,
  setIsLoading,
  isLoading,
}: ImageGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<{ index: number; path: string; direct_image_url?: string }[]>(
    [],
  )
  const [selectedSegment, setSelectedSegment] = useState(0)
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null)

  const handleGenerateImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script: sessionData.script,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setGeneratedImages(data.image_results)
        setSessionData({
          ...sessionData,
          script: data.script,
        })
        toast({
          title: 'Success',
          description: 'Image generated successfully',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate image',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error("Error generating images:", error)
      toast({
        title: 'Error',
        description: 'Failed to generate image',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateImage = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      if (!sessionData.script?.segments?.[index]) {
        throw new Error('Invalid segment index');
      }

      const segment = sessionData.script.segments[index];
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            ...sessionData.script,
            segments: [{
              ...segment,
              prompt: segment.prompt || segment.script
            }]
          }
        }),
      });

      const data = await response.json();
      
      if (!data.success || !data.image_results?.[0]) {
        throw new Error(data.error || 'Failed to regenerate image');
      }

      // Update just this segment's image
      const updatedScript = { ...sessionData.script };
      updatedScript.segments = [...sessionData.script.segments];
      updatedScript.segments[index] = {
        ...segment,
        image_path: data.image_results[0].image_path,
        direct_image_url: data.image_results[0].direct_image_url
      };

      setSessionData({
        ...sessionData,
        script: updatedScript
      });
      toast({
        title: 'Success',
        description: 'Image generated successfully',
        variant: 'default'
      })

    } catch (error) {
      console.error('Error regenerating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate image',
        variant: 'destructive'
      })
    } finally {
      setRegeneratingIndex(null);
    }
  }

  const handleGenerateVoice = async (segment: Segment) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: segment.script,
          voiceId: 'vi-VN-HoaiMyNeural' // Vietnamese female voice
        }),
      });

      const data = await response.json();
      
      if (!data.success || !data.audioUrl) {
        throw new Error(data.error || 'Failed to generate voice');
      }

      setSessionData({
        ...sessionData,
        script: {
          ...sessionData.script,
          segments: sessionData.script.segments.map(s => 
            s === segment ? {...s, audio_path: data.audioUrl} : s
          )
        }
      });
    } catch (error) {
      console.error('Voice generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold gradient-heading flex items-center">
          <ImageIcon className="h-6 w-6 mr-2 text-primary" />
          Bước 2: Tạo hình ảnh
        </h2>
        <p className="text-gray-600">Tạo hình ảnh minh họa cho từng phân đoạn trong kịch bản</p>
      </div>

      <Tabs defaultValue="script" className="w-full">
        <TabsList className="custom-tabs-list">
          <TabsTrigger value="script" className="custom-tab">
            Kịch bản
          </TabsTrigger>
          <TabsTrigger value="images" disabled={generatedImages.length === 0} className="custom-tab">
            Hình ảnh
          </TabsTrigger>
        </TabsList>

        <TabsContent value="script" className="space-y-6">
          <ScriptEditor script={sessionData.script} />

          <GradientButton
            onClick={handleGenerateImages}
            className="w-full"
            disabled={isLoading}
            isLoading={isLoading}
            loadingText="Đang tạo hình ảnh với TensorArt..."
          >
            Tạo hình ảnh cho tất cả phân đoạn
          </GradientButton>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sessionData.script.segments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div
                  className={`overflow-hidden rounded-xl card-hover cursor-pointer transition-all ${
                    selectedSegment === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSegment(index)}
                >
                  <div className="relative h-40 sm:h-48 bg-gray-50 image-container">
                    {segment.direct_image_url ? (
                      <>
                        <img
                          src={segment.direct_image_url || "/placeholder.svg"}
                          alt={`Hình ảnh cho phân đoạn ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="image-overlay"></div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">Chưa có hình ảnh</div>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRegenerateImage(index)
                      }}
                      disabled={regeneratingIndex === index}
                    >
                      {regeneratingIndex === index ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGenerateVoice(segment)
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 110 4v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 110-4V9a2 2 0 00-2-2h-6V7a3 3 0 00-3-3z" />
                      </svg>
                    </Button>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm font-medium">Phân đoạn {index + 1}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {selectedSegment !== null && (
            <motion.div
              className="rounded-xl bg-white/50 p-4 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium text-primary">Chi tiết phân đoạn {selectedSegment + 1}</h3>
              <p className="text-sm text-gray-700">{sessionData.script.segments[selectedSegment].script}</p>
              <p className="text-sm text-gray-500 italic">
                {sessionData.script.segments[selectedSegment].image_description}
              </p>
              {sessionData.script.segments[selectedSegment].audio_path && (
                <audio controls>
                  <source src={sessionData.script.segments[selectedSegment].audio_path} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        <OutlineButton onClick={onPrevious}>Quay lại</OutlineButton>
        <GradientButton onClick={onNext} disabled={generatedImages.length === 0}>
          Tiếp tục
        </GradientButton>
      </div>
    </div>
  )
}

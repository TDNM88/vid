"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { GradientButton } from "./ui-custom/gradient-button"
import { GlassCard } from "./ui-custom/glass-card"
import { Sparkles, ImageIcon, Mic, Video, CheckCircle, ArrowRight, ChevronRight, Play } from "lucide-react"

interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Tạo kịch bản thông minh",
      description:
        "Tạo kịch bản video chuyên nghiệp chỉ với vài thông tin đầu vào, được tối ưu cho từng nền tảng mạng xã hội.",
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      title: "Hình ảnh sáng tạo",
      description: "Tự động tạo hình ảnh minh họa phù hợp với nội dung kịch bản, giúp video của bạn thu hút người xem.",
    },
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "Giọng đọc tự nhiên",
      description:
        "Chuyển đổi kịch bản thành giọng đọc chất lượng cao với nhiều lựa chọn giọng đọc tiếng Việt tự nhiên.",
    },
    {
      icon: <Video className="h-8 w-8 text-primary" />,
      title: "Tạo video tự động",
      description: "Tự động ghép hình ảnh, giọng đọc và nhạc nền thành video hoàn chỉnh, sẵn sàng đăng tải.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Xuất bản dễ dàng",
      description:
        "Tải xuống video chất lượng cao và ảnh bìa tùy chỉnh, sẵn sàng chia sẻ trên mọi nền tảng mạng xã hội.",
    },
  ]

  const handleNextSlide = () => {
    if (currentSlide < features.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onStart()
    }
  }

  const handleSkip = () => {
    onStart()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left side - Hero image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          <div className="relative aspect-[4/3] w-full max-w-xl mx-auto">
            {/* Main image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-full">
                <VideoCreationIllustration />
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-3 z-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Video đã sẵn sàng</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 z-10"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">AI tạo kịch bản</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-heading">Tạo Video Mạng Xã Hội</h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Chuyển đổi ý tưởng thành video chuyên nghiệp chỉ trong vài phút với công nghệ AI tiên tiến
            </p>
          </motion.div>

          <GlassCard className="max-w-2xl w-full">
            <div className="p-4 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "w-8 bg-primary"
                          : index < currentSlide
                            ? "w-4 bg-primary/60"
                            : "w-4 bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-primary text-sm font-medium transition-colors"
                >
                  Bỏ qua
                </button>
              </div>

              <div className="relative overflow-hidden" style={{ height: "220px" }}>
                <AnimatedFeatureSlide feature={features[currentSlide]} isActive={true} />
              </div>

              <div className="mt-8 flex justify-between">
                <div className="text-sm text-gray-500">
                  {currentSlide + 1}/{features.length}
                </div>
                <GradientButton onClick={handleNextSlide} className="px-6">
                  {currentSlide < features.length - 1 ? (
                    <>
                      Tiếp theo <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Bắt đầu <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </GradientButton>
              </div>
            </div>
          </GlassCard>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <FeatureTag icon={<Sparkles className="h-4 w-4" />} text="5 bước đơn giản" />
            <FeatureTag icon={<ImageIcon className="h-4 w-4" />} text="Đa dạng nội dung" />
            <FeatureTag icon={<Mic className="h-4 w-4" />} text="Tiếng Việt tự nhiên" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function FeatureTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-100 flex items-center gap-2"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  )
}

interface AnimatedFeatureSlideProps {
  feature: {
    icon: React.ReactNode
    title: string
    description: string
  }
  isActive: boolean
}

function AnimatedFeatureSlide({ feature, isActive }: AnimatedFeatureSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-primary/10 rounded-full p-4 flex items-center justify-center"
      >
        {feature.icon}
      </motion.div>

      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-bold gradient-heading"
        >
          {feature.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-600"
        >
          {feature.description}
        </motion.p>
      </div>
    </motion.div>
  )
}

// Custom illustration component that represents video creation
function VideoCreationIllustration() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl overflow-hidden relative">
      {/* Main content frame */}
      <div className="absolute inset-8 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Video preview area */}
        <div className="h-3/5 bg-gradient-to-r from-primary/20 to-primary/10 relative">
          {/* Video content representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Play className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          </div>

          {/* Video timeline */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white/90 flex items-center px-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              />
            </div>
          </div>
        </div>

        {/* Controls area */}
        <div className="h-2/5 p-4">
          {/* Script representation */}
          <div className="space-y-2">
            <div className="w-3/4 h-3 bg-gray-200 rounded-full" />
            <div className="w-1/2 h-3 bg-gray-200 rounded-full" />
            <div className="w-2/3 h-3 bg-gray-200 rounded-full" />
          </div>

          {/* Controls representation */}
          <div className="flex justify-between mt-4">
            <div className="w-8 h-8 rounded-full bg-primary/10" />
            <div className="w-8 h-8 rounded-full bg-primary/10" />
            <div className="w-8 h-8 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="absolute bottom-12 left-4 w-8 h-8 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
      />

      {/* Social media icons representation */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
      </div>
    </div>
  )
}


import { NextResponse } from "next/server"

// Mock data for available voices
const edgeVoices = {
  vietnamese: [
    { ShortName: "vi-VN-HoaiMyNeural", FriendlyName: "Hoài My (Nữ)" },
    { ShortName: "vi-VN-NamMinhNeural", FriendlyName: "Nam Minh (Nam)" },
  ],
  english: [
    { ShortName: "en-US-AriaNeural", FriendlyName: "Aria (Nữ)" },
    { ShortName: "en-US-GuyNeural", FriendlyName: "Guy (Nam)" },
    { ShortName: "en-US-JennyNeural", FriendlyName: "Jenny (Nữ)" },
    { ShortName: "en-GB-SoniaNeural", FriendlyName: "Sonia (Nữ - Anh)" },
    { ShortName: "en-GB-RyanNeural", FriendlyName: "Ryan (Nam - Anh)" },
  ],
  other: [],
}

const openaiVoices = [
  { ShortName: "alloy", FriendlyName: "Alloy" },
  { ShortName: "echo", FriendlyName: "Echo" },
  { ShortName: "fable", FriendlyName: "Fable" },
  { ShortName: "onyx", FriendlyName: "Onyx" },
  { ShortName: "nova", FriendlyName: "Nova" },
  { ShortName: "shimmer", FriendlyName: "Shimmer" },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      voices: {
        edge_tts: edgeVoices,
        openai: openaiVoices,
      },
      has_edge_tts: true,
      has_openai_tts: true,
    })
  } catch (error) {
    console.error("Error getting available voices:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


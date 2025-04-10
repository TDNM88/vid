import { NextResponse } from "next/server"

// Mock data for available music files
const musicFiles = [
  { filename: "upbeat.mp3", path: "/static/music/upbeat.mp3" },
  { filename: "relaxing.mp3", path: "/static/music/relaxing.mp3" },
  { filename: "energetic.mp3", path: "/static/music/energetic.mp3" },
  { filename: "emotional.mp3", path: "/static/music/emotional.mp3" },
  { filename: "corporate.mp3", path: "/static/music/corporate.mp3" },
]

export async function GET() {
  try {
    return NextResponse.json({
      music_files: musicFiles,
    })
  } catch (error) {
    console.error("Error listing music files:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


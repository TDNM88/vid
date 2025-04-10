import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { script, background_music } = await req.json()

    // Get session ID from cookies
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value || uuidv4()

    // Set session ID cookie if not already set
    if (!cookieStore.get("session_id")) {
      cookieStore.set("session_id", sessionId)
    }

    // In a real implementation, this would create an actual video
    // For now, we'll just use a placeholder path
    const videoPath = `/placeholder-video.mp4`
    script.video_path = videoPath

    return NextResponse.json({
      success: true,
      video_path: videoPath,
      script,
    })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


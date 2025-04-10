import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { script, tts_service, voice } = await req.json()

    // Get session ID from cookies
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value || uuidv4()

    // Set session ID cookie if not already set
    if (!cookieStore.get("session_id")) {
      cookieStore.set("session_id", sessionId)
    }

    // Process each segment and generate audio
    const segments = script.segments
    const audioResults = []

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const scriptText = segment.script

      // In a real implementation, this would generate actual audio
      // For now, we'll just use a placeholder path
      const audioPath = `/placeholder-audio-${i + 1}.mp3`
      segment.audio_path = audioPath

      audioResults.push({
        segment: i + 1,
        text: scriptText,
        path: audioPath,
      })
    }

    return NextResponse.json({
      success: true,
      audio: audioResults,
      script,
    })
  } catch (error) {
    console.error("Error generating audio:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { script, prompt } = await req.json()

    // Get session ID from cookies
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value || uuidv4()

    // Set session ID cookie if not already set
    if (!cookieStore.get("session_id")) {
      cookieStore.set("session_id", sessionId)
    }

    // In a real implementation, this would generate an actual thumbnail
    // For now, we'll just use a placeholder path
    const thumbnailPath = `/placeholder.svg?height=720&width=1280&text=${encodeURIComponent(prompt.substring(0, 30))}`
    script.thumbnail_path = thumbnailPath

    return NextResponse.json({
      success: true,
      thumbnail_path: thumbnailPath,
      script,
    })
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


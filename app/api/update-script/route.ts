import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { script, feedback } = await req.json()

    if (!script || !feedback) {
      return NextResponse.json({ success: false, error: "Kịch bản và phản hồi là bắt buộc" }, { status: 400 })
    }

    // Check if OPENROUTER_API_KEY is available
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openRouterApiKey) {
      return NextResponse.json({ success: false, error: "OpenRouter API key không được cấu hình" }, { status: 500 })
    }

    // Create a prompt for the LLM to update the script
    const prompt = `
      Đây là kịch bản hiện tại:
      ${JSON.stringify(script, null, 2)}
      
      Phản hồi của người dùng:
      ${feedback}
      
      Hãy cập nhật kịch bản dựa trên phản hồi của người dùng. Giữ nguyên cấu trúc JSON.
    `

    // Generate updated script using OpenRouter with meta-llama/llama-4-scout:free model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://vercel.com", // Replace with your actual domain
        "X-Title": "Social Video Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout:free",
        messages: [
          {
            role: "system",
            content: "Bạn là một chuyên gia viết kịch bản video cho mạng xã hội.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenRouter API error:", errorData)
      return NextResponse.json({ success: false, error: "Lỗi khi gọi API OpenRouter" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || ""

    // Parse the JSON content from the response
    let updatedScript
    try {
      // Extract JSON from the response if needed
      let jsonContent = text

      // Check if the response is wrapped in markdown code blocks
      if (text.includes("```json") && text.includes("```")) {
        jsonContent = text.split("```json")[1].split("```")[0].trim()
      } else if (text.includes("```") && text.includes("```")) {
        const codeContent = text.split("```")[1].split("```")[0].trim()
        if (codeContent.startsWith("json")) {
          jsonContent = codeContent.substring(4).trim()
        } else {
          jsonContent = codeContent
        }
      } else {
        // Try to find JSON by looking for opening and closing braces
        const startIdx = text.indexOf("{")
        if (startIdx !== -1) {
          // Find the matching closing brace
          let braceCount = 0
          for (let i = startIdx; i < text.length; i++) {
            if (text[i] === "{") {
              braceCount++
            } else if (text[i] === "}") {
              braceCount--
              if (braceCount === 0) {
                // Found the matching closing brace
                jsonContent = text.substring(startIdx, i + 1)
                break
              }
            }
          }
        }
      }

      updatedScript = JSON.parse(jsonContent)
    } catch (error) {
      console.error("Error parsing JSON from LLM response:", error)
      return NextResponse.json({ success: false, error: "Lỗi khi phân tích kịch bản cập nhật" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      script: updatedScript,
    })
  } catch (error) {
    console.error("Error updating script:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}


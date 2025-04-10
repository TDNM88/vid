import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import crypto from "crypto"

// Function to generate image using TensorArt API
async function generateImage(prompt: string, width = 1024, height = 1024): Promise<{ url: string; error?: string }> {
  // Check if TENSORART_API_KEY is available
  const tensorArtApiKey = process.env.TENSORART_API_KEY
  if (!tensorArtApiKey) {
    console.log("TensorArt API key not found. Using placeholder image.")
    return {
      url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
    }
  }

  try {
    // Prepare request data
    const txt2imgData = {
      request_id: crypto.createHash('md5').update(Date.now().toString()).digest('hex'),
      stages: [
        {
          type: "INPUT_INITIALIZE",
          inputInitialize: {
            seed: -1,
            count: 1
          }
        },
        {
          type: "DIFFUSION",
          diffusion: {
            width: width,
            height: height,
            prompts: [{ text: prompt }],
            negativePrompts: [{ text: "nsfw" }],
            sdModel: "770694094415489962", // Fixed Model ID
            sdVae: "sdxl-vae-fp16-fix.safetensors",
            sampler: "Euler a",
            steps: 20,
            cfgScale: 3,
            clipSkip: 1,
            etaNoiseSeedDelta: 31337,
            lora: {
              items: [
                { loraModel: "766419665653268679", weight: 0.7 },
                { loraModel: "777630084346589138", weight: 0.7 },
                { loraModel: "776587863287492519", weight: 0.7 }
              ]
            }
          }
        }
      ]
    }

    // API call headers
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${tensorArtApiKey}`
    }

    console.log("Calling TensorArt API with job request")

    try {
      // Submit job
      const response = await axios.post(
        "https://ap-east-1.tensorart.cloud/v1/jobs",
        txt2imgData,
        { headers, timeout: 30000 }
      )

      if (response.status !== 200) {
        console.error("TensorArt API Error:", response.data)
        return {
          url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
          error: `API error: ${response.status} - ${JSON.stringify(response.data)}`
        }
      }

      const jobId = response.data.job.id
      console.log("Job created. ID:", jobId)

      // Poll for job completion
      const startTime = Date.now()
      const timeout = 300000 // 5 minutes

      while (true) {
        await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
        
        if (Date.now() - startTime > timeout) {
          return {
            url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
            error: `Job timed out after ${timeout/1000} seconds`
          }
        }

        const statusResponse = await axios.get(
          `https://ap-east-1.tensorart.cloud/v1/jobs/${jobId}`,
          { headers }
        )

        const jobData = statusResponse.data.job
        console.log("Job status:", jobData.status)

        if (jobData.status === 'SUCCESS') {
          if (jobData.successInfo?.images?.[0]?.url) {
            return { url: jobData.successInfo.images[0].url }
          }
          return {
            url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
            error: "Output is missing in the job response"
          }
        } else if (jobData.status === 'FAILED') {
          return {
            url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
            error: "Job failed. Please try again with different settings"
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error)
      return {
        url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
        error: String(error),
      }
    }
  } catch (error) {
    console.error("Error generating image:", error)
    return {
      url: `/placeholder.svg?height=${height}&width=${width}&text=${encodeURIComponent(prompt.substring(0, 30))}`,
      error: String(error),
    }
  }
}

export async function POST(req: Request) {
  try {
    const { script } = await req.json()

    // Get session ID from cookies
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session_id")?.value || uuidv4()

    // Create response with JSON data
    const response = NextResponse.json({
      success: true,
      script,
      image_results: []
    })

    // Set cookie if needed
    if (!cookieStore.get("session_id")) {
      response.cookies.set({
        name: "session_id",
        value: sessionId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
      })
    }

    // Process each segment and generate images
    const segments = script.segments
    const imageResults = []

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const imageDescription = segment.image_description

      // Generate image
      const { url, error } = await generateImage(imageDescription)

      if (!error) {
        // Store the image URL
        segment.image_path = url
        segment.direct_image_url = url

        imageResults.push({
          index: i,
          image_path: url,
          direct_image_url: url,
        })
      } else {
        console.error(`Error generating image for segment ${i + 1}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      script,
      image_results: imageResults,
    }, { status: 200 })
  } catch (error) {
    console.error("Error generating images:", error)
    return NextResponse.json({ success: false, error: "Lỗi máy chủ nội bộ" }, { status: 500 })
  }
}

import { NextResponse } from "next/server";
import { EdgeTTS } from "edge-tts";

const tts = new EdgeTTS();

export async function POST(req: Request) {
  try {
    const { text, voiceId = 'en-US-JennyNeural' } = await req.json();
    
    // Generate speech using Edge TTS
    const audioBuffer = await tts.synthesize({
      text,
      voice: voiceId,
      rate: '+0%',
      pitch: '+0%',
    });

    // In production, you would save this to storage and return the URL
    // For demo, we'll return the audio data directly
    return NextResponse.json({
      success: true,
      audioUrl: `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`
    });
  } catch (error) {
    console.error('Edge TTS error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}

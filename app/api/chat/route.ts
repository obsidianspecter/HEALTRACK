import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    // Prepare the messages for Ollama format
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    // Create a new TransformStream for streaming
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Start the streaming response
    const response = NextResponse.json(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

    // Make request to Ollama
    fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2',
        messages: ollamaMessages,
        stream: true,
      }),
    }).then(async (ollamaResponse) => {
      if (!ollamaResponse.ok) {
        throw new Error('Ollama API request failed')
      }

      const reader = ollamaResponse.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            await writer.close()
            break
          }

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.trim() === '') continue

            try {
              const json = JSON.parse(line)
              
              // Format the response as SSE
              const sseMessage = `data: ${JSON.stringify({
                text: json.message?.content || '',
                done: json.done || false,
              })}\n\n`
              
              await writer.write(encoder.encode(sseMessage))

              if (json.done) {
                await writer.write(encoder.encode('data: [DONE]\n\n'))
                await writer.close()
                break
              }
            } catch (e) {
              console.error('Error parsing JSON:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error processing stream:', error)
        await writer.abort(error as Error)
      }
    }).catch(async (error) => {
      console.error('Fetch error:', error)
      const errorMessage = `data: ${JSON.stringify({ error: error.message })}\n\n`
      await writer.write(encoder.encode(errorMessage))
      await writer.close()
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


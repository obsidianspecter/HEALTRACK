"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Loader2, AlertCircle, Edit2, Check, User, Bot, RefreshCw, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { chatWithLLM } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, Language } from "@/lib/translations"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface OllamaChatInterfaceProps {
  currentLanguage: Language
}

export default function OllamaChatInterface({ currentLanguage }: OllamaChatInterfaceProps) {
  // User settings
  const [userName, setUserName] = useState<string>("User")
  const [userAvatar, setUserAvatar] = useState<string>("")
  const [aiAvatar, setAiAvatar] = useState<string>("")
  const [editingName, setEditingName] = useState<boolean>(false)
  const [tempUserName, setTempUserName] = useState<string>("")
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load user settings and chat history from localStorage
  useEffect(() => {
    // Load user settings
    const savedUserName = localStorage.getItem("healthcare-chat-username")
    if (savedUserName) {
      setUserName(savedUserName)
    }

    // Generate avatars if not already saved
    const savedUserAvatar = localStorage.getItem("healthcare-user-avatar")
    if (savedUserAvatar) {
      setUserAvatar(savedUserAvatar)
    } else {
      // Generate a random seed for the user avatar
      const userSeed = Math.floor(Math.random() * 1000)
      const newUserAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`
      setUserAvatar(newUserAvatar)
      localStorage.setItem("healthcare-user-avatar", newUserAvatar)
    }

    const savedAiAvatar = localStorage.getItem("healthcare-ai-avatar")
    if (savedAiAvatar) {
      setAiAvatar(savedAiAvatar)
    } else {
      // Generate a random seed for the AI avatar
      const aiSeed = Math.floor(Math.random() * 1000)
      const newAiAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${aiSeed}`
      setAiAvatar(newAiAvatar)
      localStorage.setItem("healthcare-ai-avatar", newAiAvatar)
    }

    // Load chat history
    const savedMessages = localStorage.getItem("healthcare-chat-history")
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      // Ensure all messages have a timestamp
      const messagesWithTimestamp = parsedMessages.map((msg: Message) => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      }))
      setMessages(messagesWithTimestamp)
    } else {
      // Set default welcome message if no history exists
      const welcomeMessage: Message = {
        id: "welcome-message",
        role: "assistant" as const,
        content:
          "Hello! I'm your FemCare assistant powered by Ollama. I can help answer women's health questions, check symptoms, or recommend specialists. How can I help you today?",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      localStorage.setItem("healthcare-chat-history", JSON.stringify([welcomeMessage]))
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("healthcare-chat-history", JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Check Ollama connection status
  useEffect(() => {
    const checkOllamaStatus = async () => {
      try {
        const response = await fetch('/api/ollama-status')
        const data = await response.json()
        setConnectionStatus(data.status === 'online' ? 'connected' : 'disconnected')
      } catch (error) {
        console.error('Error checking Ollama status:', error)
        setConnectionStatus('disconnected')
      }
    }

    checkOllamaStatus()
    
    // Check status every 30 seconds
    const interval = setInterval(checkOllamaStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare messages for API
      const apiMessages = messages.concat(userMessage).map(({ role, content }) => ({ role, content }))

      // System prompt for healthcare guidance
      const systemPrompt = `You are a helpful women's health assistant.
Please follow these guidelines:
- Provide accurate, evidence-based information about women's health
- Be empathetic and understanding
- Always recommend consulting with a healthcare professional for specific medical concerns
- Focus on women's health and wellness topics
- Maintain a professional and supportive tone`

      // Call the Ollama API through our FastAPI backend
      const response = await chatWithLLM(apiMessages, systemPrompt)

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(5).trim()

            if (data === "[DONE]") {
              continue
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                assistantMessage += parsed.text

                // Update the message in real-time
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1]
                  if (lastMessage.role === "assistant" && lastMessage.id === "streaming") {
                    return [...prev.slice(0, -1), { ...lastMessage, content: assistantMessage }]
                  } else {
                    return [...prev, { 
                      id: "streaming", 
                      role: "assistant" as const, 
                      content: assistantMessage,
                      timestamp: new Date()
                    }]
                  }
                })
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e)
            }
          }
        }
      }

      // Finalize the assistant message with a proper ID
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage.role === "assistant" && lastMessage.id === "streaming") {
          return [...prev.slice(0, -1), { ...lastMessage, id: Date.now().toString() }]
        }
        return prev
      })
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant" as const,
          content: "I'm sorry, I encountered an error. Please try again later.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    // Keep only the welcome message
    const welcomeMessage: Message = {
      id: "welcome-message",
      role: "assistant" as const,
      content:
        "Hello! I'm your FemCare assistant powered by Ollama. I can help answer women's health questions, check symptoms, or recommend specialists. How can I help you today?",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    localStorage.setItem("healthcare-chat-history", JSON.stringify([welcomeMessage]))
  }

  const handleSaveUserName = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName)
      localStorage.setItem("healthcare-chat-username", tempUserName)
    }
    setEditingName(false)
  }

  const handleGenerateNewAvatars = () => {
    // Generate new random avatars
    const userSeed = Math.floor(Math.random() * 1000)
    const aiSeed = Math.floor(Math.random() * 1000)
    const newUserAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userSeed}`
    const newAiAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${aiSeed}`
    setUserAvatar(newUserAvatar)
    setAiAvatar(newAiAvatar)
    localStorage.setItem("healthcare-user-avatar", newUserAvatar)
    localStorage.setItem("healthcare-ai-avatar", newAiAvatar)
  }

  const getMessageStyle = (role: "user" | "assistant") => {
    return role === "user"
      ? "bg-primary text-primary-foreground ml-auto"
      : "bg-muted"
  }

  return (
    <div className="flex flex-col h-full">
      {connectionStatus === 'disconnected' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to Ollama. Please make sure Ollama is running and try again.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{translations.dashboard[currentLanguage].yourName}</label>
                  {editingName ? (
                    <div className="flex gap-2">
                      <Input
                        value={tempUserName}
                        onChange={(e) => setTempUserName(e.target.value)}
                        placeholder={translations.dashboard[currentLanguage].enterName}
                      />
                      <Button size="icon" onClick={handleSaveUserName}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{userName}</span>
                      <Button variant="ghost" size="icon" onClick={() => setEditingName(true)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{translations.dashboard[currentLanguage].avatars}</label>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={userAvatar} />
                        <AvatarFallback>{userName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs mt-1">{translations.dashboard[currentLanguage].you}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={aiAvatar} />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <span className="text-xs mt-1">{translations.dashboard[currentLanguage].assistant}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={handleGenerateNewAvatars}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleClearChat}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <h2 className="text-xl font-semibold">{translations.dashboard[currentLanguage].aiAssistant}</h2>
        </div>
        <Badge variant="outline" className={cn(
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          connectionStatus === 'disconnected' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
        )}>
          {connectionStatus === 'connected' ? translations.dashboard[currentLanguage].connected : translations.dashboard[currentLanguage].disconnected}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn("mb-4 flex", message.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "flex items-start gap-3 max-w-[80%]",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <Avatar
                  className={cn(
                    "h-8 w-8",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted-foreground text-muted",
                  )}
                >
                  <AvatarImage
                    src={message.role === "user" ? userAvatar : aiAvatar}
                    alt={message.role === "user" ? userName : translations.dashboard[currentLanguage].aiAssistant}
                  />
                  <AvatarFallback>
                    {message.role === "user" ? userName[0] : "AI"}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={cn(
                    "p-3",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={translations.dashboard[currentLanguage].typeHealthQuestion}
            className="min-h-[60px] flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  )
}


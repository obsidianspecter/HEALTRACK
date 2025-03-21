"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { translations } from "./landing-page"

type PeriodData = {
  date: Date
  flow: "light" | "medium" | "heavy"
  symptoms: string[]
  mood: "happy" | "neutral" | "sad"
  notes: string
}

export default function PeriodTracker() {
  const [currentLanguage, setCurrentLanguage] = useState<keyof typeof translations.title>("english")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [periodData, setPeriodData] = useState<PeriodData[]>([])
  const [flow, setFlow] = useState<"light" | "medium" | "heavy">("medium")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [mood, setMood] = useState<"happy" | "neutral" | "sad">("neutral")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("period-tracker-data")
    if (savedData) {
      setPeriodData(JSON.parse(savedData))
    }

    // Load language preference
    const savedLanguage = localStorage.getItem("femcare-language") as keyof typeof translations.title
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem("period-tracker-data", JSON.stringify(periodData))
  }, [periodData])

  const handleSaveEntry = () => {
    if (!selectedDate) return

    const newEntry: PeriodData = {
      date: selectedDate,
      flow,
      symptoms,
      mood,
      notes,
    }

    setPeriodData((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.date.toDateString() === selectedDate.toDateString()
      )
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newEntry
        return updated
      }
      return [...prev, newEntry]
    })

    // Reset form
    setFlow("medium")
    setSymptoms([])
    setMood("neutral")
    setNotes("")
  }

  const getFlowColor = (flow: "light" | "medium" | "heavy") => {
    switch (flow) {
      case "light":
        return "#FFB6C1" // Light pink
      case "medium":
        return "#FF69B4" // Medium pink
      case "heavy":
        return "#FF1493" // Deep pink
      default:
        return "#FFB6C1"
    }
  }

  const getMoodEmoji = (mood: "happy" | "neutral" | "sad") => {
    switch (mood) {
      case "happy":
        return "😊"
      case "neutral":
        return "😐"
      case "sad":
        return "😔"
      default:
        return "😐"
    }
  }

  // Prepare data for the chart
  const chartData = periodData.map((entry) => ({
    date: entry.date.toLocaleDateString(),
    flow: entry.flow === "light" ? 1 : entry.flow === "medium" ? 2 : 3,
    mood: entry.mood === "happy" ? 3 : entry.mood === "neutral" ? 2 : 1,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar and Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle>{translations.dashboard[currentLanguage].trackPeriod}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Flow Intensity</Label>
                <Select value={flow} onValueChange={(value: "light" | "medium" | "heavy") => setFlow(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Symptoms</Label>
                <Select
                  value={symptoms.join(",")}
                  onValueChange={(value) => setSymptoms(value.split(",").filter(Boolean))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cramps">Cramps</SelectItem>
                    <SelectItem value="headache">Headache</SelectItem>
                    <SelectItem value="bloating">Bloating</SelectItem>
                    <SelectItem value="fatigue">Fatigue</SelectItem>
                    <SelectItem value="mood swings">Mood Swings</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mood</Label>
                <Select value={mood} onValueChange={(value: "happy" | "neutral" | "sad") => setMood(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">Happy 😊</SelectItem>
                    <SelectItem value="neutral">Neutral 😐</SelectItem>
                    <SelectItem value="sad">Sad 😔</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                />
              </div>

              <Button onClick={handleSaveEntry} className="w-full">
                Save Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics and Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Period Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="flow"
                    stroke="#FF69B4"
                    name="Flow Intensity"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#FFB6C1"
                    name="Mood"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Cycle Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">28 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Period Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">5 days</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periodData
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{entry.date.toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Flow: {entry.flow} • Mood: {getMoodEmoji(entry.mood)}
                    </p>
                    {entry.symptoms.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Symptoms: {entry.symptoms.join(", ")}
                      </p>
                    )}
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getFlowColor(entry.flow) }}
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
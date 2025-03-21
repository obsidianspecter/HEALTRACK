"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, CalendarIcon, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isSameDay } from "date-fns"

// Define journal entry type
type JournalEntry = {
  id: string
  title: string
  content: string
  date: string // ISO string
  mood: "great" | "good" | "okay" | "bad" | "terrible"
  symptoms: string[]
}

export default function HealthJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, "id">>({
    title: "",
    content: "",
    date: new Date().toISOString(),
    mood: "good",
    symptoms: [],
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [symptomInput, setSymptomInput] = useState("")
  const [editingEntry, setEditingEntry] = useState<string | null>(null)

  // Load entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("healthcare-journal")
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  // Save entries to localStorage
  const saveEntries = (journalEntries: JournalEntry[]) => {
    localStorage.setItem("healthcare-journal", JSON.stringify(journalEntries))
    setEntries(journalEntries)
  }

  // Add new entry
  const addEntry = () => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      ...newEntry,
    }

    const updatedEntries = [...entries, entry]
    saveEntries(updatedEntries)
    setDialogOpen(false)
    setNewEntry({
      title: "",
      content: "",
      date: new Date().toISOString(),
      mood: "good",
      symptoms: [],
    })
    setSymptomInput("")
  }

  // Delete entry
  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    saveEntries(updatedEntries)
  }

  // Update entry
  const updateEntry = (id: string, updatedData: Partial<JournalEntry>) => {
    const updatedEntries = entries.map((entry) => {
      if (entry.id === id) {
        return { ...entry, ...updatedData }
      }
      return entry
    })
    saveEntries(updatedEntries)
    setEditingEntry(null)
  }

  // Add symptom to new entry
  const addSymptom = () => {
    if (symptomInput.trim() && !newEntry.symptoms.includes(symptomInput.trim())) {
      setNewEntry({
        ...newEntry,
        symptoms: [...newEntry.symptoms, symptomInput.trim()],
      })
      setSymptomInput("")
    }
  }

  // Remove symptom from new entry
  const removeSymptom = (symptom: string) => {
    setNewEntry({
      ...newEntry,
      symptoms: newEntry.symptoms.filter((s) => s !== symptom),
    })
  }

  // Get entries by date
  const getEntriesByDate = (date: Date) => {
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return isSameDay(entryDate, date)
    })
  }

  // Get mood emoji
  const getMoodEmoji = (mood: JournalEntry["mood"]) => {
    switch (mood) {
      case "great":
        return "😄"
      case "good":
        return "🙂"
      case "okay":
        return "😐"
      case "bad":
        return "😔"
      case "terrible":
        return "😣"
      default:
        return "🙂"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Health Journal</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Journal Entry</DialogTitle>
              <DialogDescription>Record how you're feeling today and track any symptoms.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                  placeholder="How I'm feeling today"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEntry.date ? format(new Date(newEntry.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(newEntry.date)}
                      onSelect={(date) => date && setNewEntry({ ...newEntry, date: date.toISOString() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">Mood</Label>
                <div className="flex justify-between">
                  {(["terrible", "bad", "okay", "good", "great"] as const).map((mood) => (
                    <Button
                      key={mood}
                      type="button"
                      variant={newEntry.mood === mood ? "default" : "outline"}
                      className="flex-1 mx-1"
                      onClick={() => setNewEntry({ ...newEntry, mood })}
                    >
                      {getMoodEmoji(mood)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <div className="flex space-x-2">
                  <Input
                    id="symptoms"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    placeholder="Add a symptom"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSymptom()
                      }
                    }}
                  />
                  <Button type="button" onClick={addSymptom}>
                    Add
                  </Button>
                </div>
                {newEntry.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newEntry.symptoms.map((symptom) => (
                      <div key={symptom} className="bg-muted px-2 py-1 rounded-md flex items-center">
                        <span className="text-sm">{symptom}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeSymptom(symptom)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Journal Entry</Label>
                <Textarea
                  id="content"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Write about how you're feeling today..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addEntry} disabled={!newEntry.title || !newEntry.content}>
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Entries</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {entries.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No journal entries yet. Start tracking your health journey today.</p>
              </CardContent>
            </Card>
          ) : (
            entries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CardTitle>{entry.title}</CardTitle>
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {editingEntry === entry.id ? (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateEntry(entry.id, { content: entry.content })}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="outline" size="icon" onClick={() => setEditingEntry(entry.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{format(new Date(entry.date), "MMMM d, yyyy")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {editingEntry === entry.id ? (
                      <Textarea
                        value={entry.content}
                        onChange={(e) => {
                          const updatedEntries = entries.map((item) => {
                            if (item.id === entry.id) {
                              return { ...item, content: e.target.value }
                            }
                            return item
                          })
                          setEntries(updatedEntries)
                        }}
                        rows={5}
                        className="mb-4"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{entry.content}</div>
                    )}

                    {entry.symptoms.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Symptoms:</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.symptoms.map((symptom) => (
                            <div key={symptom} className="bg-muted px-2 py-1 rounded-md">
                              <span className="text-sm">{symptom}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-lg font-medium mb-2">Entries for {format(selectedDate, "MMMM d, yyyy")}</h3>
                  {getEntriesByDate(selectedDate).length === 0 ? (
                    <p className="text-muted-foreground">No entries for this date.</p>
                  ) : (
                    <div className="space-y-4">
                      {getEntriesByDate(selectedDate).map((entry) => (
                        <div key={entry.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{entry.title}</p>
                              <span>{getMoodEmoji(entry.mood)}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteEntry(entry.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm mt-2 line-clamp-3">{entry.content}</p>
                          {entry.symptoms.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">Symptoms: {entry.symptoms.join(", ")}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


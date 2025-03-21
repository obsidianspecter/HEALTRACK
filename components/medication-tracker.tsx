"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Check, X, Clock, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Define medication type
type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string
  notes: string
  taken: boolean[]
}

export default function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [newMedication, setNewMedication] = useState<Omit<Medication, "id" | "taken">>({
    name: "",
    dosage: "",
    frequency: "daily",
    time: "08:00",
    notes: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [date, setDate] = useState<Date>(new Date())

  // Load medications from localStorage
  useEffect(() => {
    const savedMedications = localStorage.getItem("healthcareMedications")
    if (savedMedications) {
      setMedications(JSON.parse(savedMedications))
    }
  }, [])

  // Save medications to localStorage
  const saveMedications = (meds: Medication[]) => {
    localStorage.setItem("healthcareMedications", JSON.stringify(meds))
    setMedications(meds)
  }

  // Add new medication
  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      ...newMedication,
      taken: Array(
        Number.parseInt(newMedication.frequency === "daily" ? "1" : newMedication.frequency.split(" ")[0]),
      ).fill(false),
    }

    const updatedMedications = [...medications, newMed]
    saveMedications(updatedMedications)
    setDialogOpen(false)
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "daily",
      time: "08:00",
      notes: "",
    })
  }

  // Delete medication
  const deleteMedication = (id: string) => {
    const updatedMedications = medications.filter((med) => med.id !== id)
    saveMedications(updatedMedications)
  }

  // Toggle medication taken status
  const toggleMedicationStatus = (medId: string, index: number) => {
    const updatedMedications = medications.map((med) => {
      if (med.id === medId) {
        const updatedTaken = [...med.taken]
        updatedTaken[index] = !updatedTaken[index]
        return { ...med, taken: updatedTaken }
      }
      return med
    })
    saveMedications(updatedMedications)
  }

  // Calculate progress for each medication
  const calculateProgress = (taken: boolean[]) => {
    if (taken.length === 0) return 0
    const takenCount = taken.filter((status) => status).length
    return (takenCount / taken.length) * 100
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medication Tracker</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details of your medication and schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 10mg, 1 tablet"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Once daily</SelectItem>
                    <SelectItem value="2 times daily">Twice daily</SelectItem>
                    <SelectItem value="3 times daily">Three times daily</SelectItem>
                    <SelectItem value="weekly">Once weekly</SelectItem>
                    <SelectItem value="as needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Take with food"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addMedication} disabled={!newMedication.name || !newMedication.dosage}>
                Add Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="all">All Medications</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {medications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No medications added yet. Add your first medication to get started.</p>
              </CardContent>
            </Card>
          ) : (
            medications.map((med) => (
              <Card key={med.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{med.name}</CardTitle>
                      <CardDescription>
                        {med.dosage} - {med.frequency}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{med.time}</span>
                      </div>
                      <div>
                        {med.taken.map((status, index) => (
                          <Button
                            key={index}
                            variant={status ? "default" : "outline"}
                            size="sm"
                            className="ml-2"
                            onClick={() => toggleMedicationStatus(med.id, index)}
                          >
                            {status ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            {med.frequency !== "daily" && ` Dose ${index + 1}`}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {med.taken.filter((t) => t).length}/{med.taken.length}
                        </span>
                      </div>
                      <Progress value={calculateProgress(med.taken)} className="h-2" />
                    </div>
                    {med.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {med.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-4">
          {medications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No medications added yet. Add your first medication to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medications.map((med) => (
                <Card key={med.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{med.name}</CardTitle>
                        <CardDescription>
                          {med.dosage} - {med.frequency}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{med.time}</span>
                      </div>
                      {med.notes && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {med.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-lg font-medium mb-2">Medications for {format(date, "MMMM d, yyyy")}</h3>
                  {medications.length === 0 ? (
                    <p className="text-muted-foreground">No medications scheduled.</p>
                  ) : (
                    <div className="space-y-2">
                      {medications.map((med) => (
                        <div key={med.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dosage} - {med.time}
                            </p>
                          </div>
                          <Badge variant={med.taken.some((t) => t) ? "default" : "outline"}>
                            {med.taken.some((t) => t) ? "Taken" : "Not Taken"}
                          </Badge>
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


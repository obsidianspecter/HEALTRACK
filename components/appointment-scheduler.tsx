"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, CalendarIcon, Clock, MapPin } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isBefore, isToday, isSameDay } from "date-fns"

// Define appointment type
type Appointment = {
  id: string
  doctorName: string
  specialty: string
  date: string // ISO string
  time: string
  location: string
  notes: string
}

export default function AppointmentScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, "id">>({
    doctorName: "",
    specialty: "",
    date: new Date().toISOString(),
    time: "09:00",
    location: "",
    notes: "",
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("healthcareAppointments")
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
  }, [])

  // Save appointments to localStorage
  const saveAppointments = (appts: Appointment[]) => {
    localStorage.setItem("healthcareAppointments", JSON.stringify(appts))
    setAppointments(appts)
  }

  // Add new appointment
  const addAppointment = () => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      ...newAppointment,
    }

    const updatedAppointments = [...appointments, newAppt]
    saveAppointments(updatedAppointments)
    setDialogOpen(false)
    setNewAppointment({
      doctorName: "",
      specialty: "",
      date: new Date().toISOString(),
      time: "09:00",
      location: "",
      notes: "",
    })
  }

  // Delete appointment
  const deleteAppointment = (id: string) => {
    const updatedAppointments = appointments.filter((appt) => appt.id !== id)
    saveAppointments(updatedAppointments)
  }

  // Filter appointments by date
  const getAppointmentsByDate = (date: Date) => {
    return appointments.filter((appt) => {
      const apptDate = new Date(appt.date)
      return isSameDay(apptDate, date)
    })
  }

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    return appointments
      .filter((appt) => {
        const apptDate = new Date(appt.date)
        return !isBefore(apptDate, new Date()) || isToday(apptDate)
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Get past appointments
  const getPastAppointments = () => {
    return appointments
      .filter((appt) => {
        const apptDate = new Date(appt.date)
        return isBefore(apptDate, new Date()) && !isToday(apptDate)
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointment Scheduler</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Enter the details of your upcoming appointment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctorName" className="text-right">
                  Doctor
                </Label>
                <Input
                  id="doctorName"
                  value={newAppointment.doctorName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                  className="col-span-3"
                  placeholder="Dr. Smith"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialty" className="text-right">
                  Specialty
                </Label>
                <Input
                  id="specialty"
                  value={newAppointment.specialty}
                  onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Cardiology, Dermatology"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAppointment.date ? format(new Date(newAppointment.date), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(newAppointment.date)}
                        onSelect={(date) => date && setNewAppointment({ ...newAppointment, date: date.toISOString() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  className="col-span-3"
                  placeholder="123 Medical Center Dr."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Reason for visit, questions to ask, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addAppointment} disabled={!newAppointment.doctorName}>
                Schedule Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {getUpcomingAppointments().length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No upcoming appointments. Schedule your next appointment to get started.</p>
              </CardContent>
            </Card>
          ) : (
            getUpcomingAppointments().map((appt) => (
              <Card key={appt.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{appt.doctorName}</CardTitle>
                      <CardDescription>{appt.specialty}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {isToday(new Date(appt.date)) && <Badge>Today</Badge>}
                      <Button variant="ghost" size="icon" onClick={() => deleteAppointment(appt.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{format(new Date(appt.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appt.time}</span>
                    </div>
                    {appt.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{appt.location}</span>
                      </div>
                    )}
                    {appt.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {appt.notes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {getPastAppointments().length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No past appointments found.</p>
              </CardContent>
            </Card>
          ) : (
            getPastAppointments().map((appt) => (
              <Card key={appt.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{appt.doctorName}</CardTitle>
                      <CardDescription>{appt.specialty}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteAppointment(appt.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{format(new Date(appt.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{appt.time}</span>
                    </div>
                    {appt.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{appt.location}</span>
                      </div>
                    )}
                    {appt.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {appt.notes}
                      </div>
                    )}
                  </div>
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
                  <h3 className="text-lg font-medium mb-2">Appointments for {format(selectedDate, "MMMM d, yyyy")}</h3>
                  {getAppointmentsByDate(selectedDate).length === 0 ? (
                    <p className="text-muted-foreground">No appointments scheduled for this date.</p>
                  ) : (
                    <div className="space-y-2">
                      {getAppointmentsByDate(selectedDate).map((appt) => (
                        <div key={appt.id} className="p-3 border rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{appt.doctorName}</p>
                              <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => deleteAppointment(appt.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span className="text-sm">{appt.time}</span>
                            </div>
                            {appt.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="text-sm">{appt.location}</span>
                              </div>
                            )}
                          </div>
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


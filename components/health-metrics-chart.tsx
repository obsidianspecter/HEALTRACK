"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { format } from "date-fns"

export default function HealthMetricsChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [metricType, setMetricType] = useState("weight")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newMetric, setNewMetric] = useState({
    type: "weight",
    value: "",
    systolic: "",
    diastolic: "",
    date: format(new Date(), "yyyy-MM-dd"),
  })

  // State for user metrics
  const [weightData, setWeightData] = useState([])
  const [bpData, setBpData] = useState([])
  const [glucoseData, setGlucoseData] = useState([])

  useEffect(() => {
    setMounted(true)

    // Load data from localStorage
    const savedWeightData = localStorage.getItem("healthcareWeightData")
    if (savedWeightData) {
      setWeightData(JSON.parse(savedWeightData))
    }

    const savedBpData = localStorage.getItem("healthcareBpData")
    if (savedBpData) {
      setBpData(JSON.parse(savedBpData))
    }

    const savedGlucoseData = localStorage.getItem("healthcareGlucoseData")
    if (savedGlucoseData) {
      setGlucoseData(JSON.parse(savedGlucoseData))
    }
  }, [])

  const addMetric = () => {
    const date = format(new Date(newMetric.date), "MMM d")

    if (newMetric.type === "weight" && newMetric.value) {
      const newData = [...weightData, { date, value: Number.parseFloat(newMetric.value) }]
      setWeightData(newData)
      localStorage.setItem("healthcareWeightData", JSON.stringify(newData))
    } else if (newMetric.type === "bloodPressure" && newMetric.systolic && newMetric.diastolic) {
      const newData = [
        ...bpData,
        {
          date,
          systolic: Number.parseFloat(newMetric.systolic),
          diastolic: Number.parseFloat(newMetric.diastolic),
        },
      ]
      setBpData(newData)
      localStorage.setItem("healthcareBpData", JSON.stringify(newData))
    } else if (newMetric.type === "glucose" && newMetric.value) {
      const newData = [...glucoseData, { date, value: Number.parseFloat(newMetric.value) }]
      setGlucoseData(newData)
      localStorage.setItem("healthcareGlucoseData", JSON.stringify(newData))
    }

    setDialogOpen(false)
    setNewMetric({
      type: "weight",
      value: "",
      systolic: "",
      diastolic: "",
      date: format(new Date(), "yyyy-MM-dd"),
    })
  }

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>
  }

  const isDark = theme === "dark"
  const textColor = isDark ? "#ffffff" : "#000000"
  const gridColor = isDark ? "#333333" : "#e5e5e5"

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Health Metrics Tracker</h3>
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight (kg)</SelectItem>
              <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
              <SelectItem value="glucose">Blood Glucose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Data Point
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Health Metric</DialogTitle>
              <DialogDescription>Record a new health measurement to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="metricType" className="text-right">
                  Metric Type
                </Label>
                <Select value={newMetric.type} onValueChange={(value) => setNewMetric({ ...newMetric, type: value })}>
                  <SelectTrigger id="metricType" className="col-span-3">
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight (kg)</SelectItem>
                    <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                    <SelectItem value="glucose">Blood Glucose (mg/dL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newMetric.type === "bloodPressure" ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="systolic" className="text-right">
                      Systolic
                    </Label>
                    <Input
                      id="systolic"
                      type="number"
                      value={newMetric.systolic}
                      onChange={(e) => setNewMetric({ ...newMetric, systolic: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diastolic" className="text-right">
                      Diastolic
                    </Label>
                    <Input
                      id="diastolic"
                      type="number"
                      value={newMetric.diastolic}
                      onChange={(e) => setNewMetric({ ...newMetric, diastolic: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 80"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                    className="col-span-3"
                    placeholder={newMetric.type === "weight" ? "e.g., 70" : "e.g., 95"}
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newMetric.date}
                  onChange={(e) => setNewMetric({ ...newMetric, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addMetric}>Add Measurement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {metricType === "weight" ? (
            weightData.length > 0 ? (
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="value" name="Weight (kg)" stroke="#2563eb" activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No weight data available. Add your first measurement.</p>
              </div>
            )
          ) : metricType === "bloodPressure" ? (
            bpData.length > 0 ? (
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={textColor} />
                <YAxis stroke={textColor} domain={["dataMin - 10", "dataMax + 10"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: textColor,
                    border: `1px solid ${gridColor}`,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#ef4444" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#8b5cf6" activeDot={{ r: 8 }} />
              </LineChart>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No blood pressure data available. Add your first measurement.</p>
              </div>
            )
          ) : glucoseData.length > 0 ? (
            <LineChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" stroke={textColor} />
              <YAxis stroke={textColor} domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#333" : "#fff",
                  color: textColor,
                  border: `1px solid ${gridColor}`,
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" name="Glucose (mg/dL)" stroke="#10b981" activeDot={{ r: 8 }} />
            </LineChart>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No glucose data available. Add your first measurement.</p>
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}


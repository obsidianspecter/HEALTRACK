"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Activity, Calendar, Pill, Settings, User, Menu, X, ArrowLeft, Shield, LogOut, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import HealthMetricsChart from "@/components/health-metrics-chart"
import MedicationTracker from "@/components/medication-tracker"
import AppointmentScheduler from "@/components/appointment-scheduler"
import HealthJournal from "@/components/health-journal"
import OllamaChatInterface from "@/components/ollama-chat-interface"
import PeriodTracker from "@/components/period-tracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { translations } from "./landing-page"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300 },
  },
}

type UserData = {
  name: string
  email: string
  age: number
  height: number
  weight: number
  bloodType: string
  conditions: string
  preferences: Record<string, unknown>
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMobile()
  const { theme } = useTheme()

  // Load user data from localStorage
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    age: 0,
    height: 0,
    weight: 0,
    bloodType: "",
    conditions: "",
    preferences: {},
  })

  // Add inside the Dashboard component, after the userData state
  const [currentLanguage, setCurrentLanguage] = useState<keyof typeof translations.title>("english")

  useEffect(() => {
    // Check if we're on mobile and close sidebar if so
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }

    // Load user data from localStorage
    const savedUserData = localStorage.getItem("femcare-user-data")
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData))
    }

    // Load language preference
    const savedLanguage = localStorage.getItem("femcare-language") as keyof typeof translations.title
    if (savedLanguage && translations.title[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [isMobile])

  // Save user data to localStorage
  const saveUserData = (data: UserData) => {
    localStorage.setItem("femcare-user-data", JSON.stringify(data))
    setUserData(data)
  }

  // Navigate back to landing page
  const navigateToLanding = () => {
    router.push("/")
  }

  // Navigate to admin page
  const navigateToAdmin = () => {
    router.push("/admin")
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "bg-card border-r transition-all duration-300 flex flex-col z-20",
              sidebarOpen ? "w-64" : "w-0 md:w-16",
              isMobile && !sidebarOpen && "hidden",
            )}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn("font-bold text-xl text-primary", !sidebarOpen && "md:hidden")}
              >
                {translations.title[currentLanguage]}
              </motion.h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:flex hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 py-4">
              <motion.nav className="space-y-2 px-2" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "overview" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("overview")}
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Overview</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "chat" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Chat Assistant</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "medications" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("medications")}
                  >
                    <Pill className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Medications</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "period" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("period")}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Period Tracker</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "appointments" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("appointments")}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Appointments</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "journal" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("journal")}
                  >
                    <User className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Health Journal</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Settings</span>
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", !sidebarOpen && "md:justify-center")}
                    onClick={navigateToAdmin}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    <span className={cn(!sidebarOpen && "md:hidden")}>Admin</span>
                  </Button>
                </motion.div>
              </motion.nav>
            </div>

            <div className="p-4 border-t">
              <div className={cn("flex items-center", !sidebarOpen && "md:justify-center")}>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {userData.name ? userData.name.charAt(0) : "U"}
                </div>
                <div className={cn("ml-2", !sidebarOpen && "md:hidden")}>
                  <p className="text-sm font-medium">{userData.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{userData.email || "user@example.com"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center">
            {!sidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            )}

            {activeTab !== "overview" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab("overview")}
                className="mr-2"
                aria-label="Back to overview"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-xl font-semibold"
            >
              {activeTab === "overview" && translations.dashboard[currentLanguage].overview}
              {activeTab === "chat" && translations.dashboard[currentLanguage].chatAssistant}
              {activeTab === "medications" && translations.dashboard[currentLanguage].medications}
              {activeTab === "appointments" && translations.dashboard[currentLanguage].appointments}
              {activeTab === "journal" && translations.dashboard[currentLanguage].journal}
              {activeTab === "settings" && translations.dashboard[currentLanguage].settings}
            </motion.h1>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.keys(translations.title).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => {
                      setCurrentLanguage(lang as keyof typeof translations.title)
                      localStorage.setItem("femcare-language", lang)
                    }}
                  >
                    {translations.languageNames[lang as keyof typeof translations.title]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" onClick={navigateToLanding}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {translations.dashboard[currentLanguage].backToHome}
              </Button>
            </motion.div>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{translations.dashboard[currentLanguage].myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                  {translations.dashboard[currentLanguage].profileSettings}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {translations.dashboard[currentLanguage].helpSupport}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  {translations.dashboard[currentLanguage].logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <motion.div variants={itemVariants} className="col-span-full">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>{translations.features[currentLanguage][1]}</CardTitle>
                        <CardDescription>
                          {translations.dashboard[currentLanguage].upcomingEvents}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <HealthMetricsChart />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>{translations.features[currentLanguage][3]}</CardTitle>
                        <CardDescription>
                          {translations.dashboard[currentLanguage].nextAppointments}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            {translations.dashboard[currentLanguage].noAppointments}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {translations.dashboard[currentLanguage].scheduleAppointment}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("appointments")}>
                          {translations.dashboard[currentLanguage].viewAllAppointments}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>{translations.features[currentLanguage][0]}</CardTitle>
                        <CardDescription>
                          {translations.dashboard[currentLanguage].trackPeriod}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            {translations.dashboard[currentLanguage].startTracking}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {translations.dashboard[currentLanguage].monitorCycle}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("period")}>
                          {translations.dashboard[currentLanguage].viewPeriodTracker}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Medication Tracker</CardTitle>
                        <CardDescription>
                          Track your medications and set reminders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            No medications scheduled
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Add medications to start tracking
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("medications")}>
                          View Medication Tracker
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Health Journal</CardTitle>
                        <CardDescription>
                          {translations.dashboard[currentLanguage].noJournalEntries}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">
                            {translations.dashboard[currentLanguage].startJournal}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {translations.dashboard[currentLanguage].startJournal}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab("journal")}>
                          {translations.dashboard[currentLanguage].viewJournal}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>{translations.features[currentLanguage][2]}</CardTitle>
                        <CardDescription>
                          {translations.dashboard[currentLanguage].aiDescription}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">
                          {translations.dashboard[currentLanguage].aiDescription}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={() => setActiveTab("chat")}>
                          {translations.dashboard[currentLanguage].chatWithAssistant}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "chat" && (
                <div className="h-[calc(100vh-8rem)] w-full">
                  <OllamaChatInterface />
                </div>
              )}

              {activeTab === "period" && (
                <div className="h-[calc(100vh-8rem)] w-full p-6 overflow-auto">
                  <PeriodTracker />
                </div>
              )}

              {activeTab === "medications" && <MedicationTracker />}

              {activeTab === "appointments" && <AppointmentScheduler />}

              {activeTab === "journal" && <HealthJournal />}

              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl mx-auto"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        {translations.dashboard[currentLanguage].manageAccount}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{translations.dashboard[currentLanguage].fullName}</Label>
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            placeholder={translations.dashboard[currentLanguage].enterName}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{translations.dashboard[currentLanguage].email}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            placeholder={translations.dashboard[currentLanguage].enterEmail}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">{translations.dashboard[currentLanguage].age}</Label>
                          <Input
                            id="age"
                            type="number"
                            value={userData.age || ""}
                            onChange={(e) => setUserData({ ...userData, age: Number.parseInt(e.target.value) || 0 })}
                            placeholder={translations.dashboard[currentLanguage].enterAge}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="height">{translations.dashboard[currentLanguage].height}</Label>
                          <Input
                            id="height"
                            type="number"
                            value={userData.height || ""}
                            onChange={(e) => setUserData({ ...userData, height: Number.parseInt(e.target.value) || 0 })}
                            placeholder={translations.dashboard[currentLanguage].enterHeight}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">{translations.dashboard[currentLanguage].weight}</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={userData.weight || ""}
                            onChange={(e) => setUserData({ ...userData, weight: Number.parseInt(e.target.value) || 0 })}
                            placeholder={translations.dashboard[currentLanguage].enterWeight}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">{translations.dashboard[currentLanguage].bloodType}</Label>
                          <Select
                            value={userData.bloodType}
                            onValueChange={(value) => setUserData({ ...userData, bloodType: value })}
                          >
                            <SelectTrigger id="bloodType">
                              <SelectValue placeholder={translations.dashboard[currentLanguage].selectBloodType} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="conditions">{translations.dashboard[currentLanguage].medicalConditions}</Label>
                        <Textarea
                          id="conditions"
                          placeholder={translations.dashboard[currentLanguage].conditionsPlaceholder}
                          value={userData.conditions}
                          onChange={(e) => setUserData({ ...userData, conditions: e.target.value })}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => saveUserData(userData)}>
                          {translations.dashboard[currentLanguage].saveChanges}
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}


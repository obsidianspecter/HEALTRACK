"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"

const translations = {
  title: {
    english: "Healthcare Assistant",
    spanish: "Asistente de Salud",
    french: "Assistant de Santé",
    german: "Gesundheitsassistent",
    chinese: "健康助手",
    japanese: "ヘルスケアアシスタント",
    arabic: "مساعد الرعاية الصحية",
    hindi: "स्वास्थ्य सहायक",
    russian: "Помощник по здоровью",
  },
  subtitle: {
    english: "Your personal health companion",
    spanish: "Tu compañero personal de salud",
    french: "Votre compagnon santé personnel",
    german: "Ihr persönlicher Gesundheitsbegleiter",
    chinese: "您的个人健康伴侣",
    japanese: "あなたの個人的な健康の伴侣",
    arabic: "رفيقك الصحي الشخصي",
    hindi: "आपका व्यक्तिगत स्वास्थ्य साथी",
    russian: "Ваш личный помощник по здоровью",
  },
  cta: {
    english: "Get Started",
    spanish: "Comenzar",
    french: "Commencer",
    german: "Loslegen",
    chinese: "开始使用",
    japanese: "始める",
    arabic: "البدء",
    hindi: "शुरू करें",
    russian: "Начать",
  },
}

type Language = keyof typeof translations.title

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
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

export default function LandingPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("english")
  const [glitching, setGlitching] = useState(false)
  const languages = Object.keys(translations.title) as Language[]

  useEffect(() => {
    // Change language every 3 seconds
    const interval = setInterval(() => {
      setGlitching(true)

      // After a short delay, change the language
      setTimeout(() => {
        setCurrentLanguage((prevLang) => {
          const currentIndex = languages.indexOf(prevLang)
          const nextIndex = (currentIndex + 1) % languages.length
          return languages[nextIndex]
        })

        // Reset glitch effect
        setTimeout(() => {
          setGlitching(false)
        }, 150)
      }, 150)
    }, 3000)

    return () => clearInterval(interval)
  }, [languages])

  const navigateToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <motion.div className="flex flex-col min-h-screen" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Header */}
      <motion.header className="p-4 flex justify-end" variants={itemVariants}>
        <ThemeToggle />
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <motion.div className="max-w-3xl mx-auto" variants={containerVariants}>
          <motion.h1
            className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-100 ${
              glitching ? "text-glitch" : ""
            }`}
            style={{
              textShadow: glitching ? "2px 2px #ff00ea, -2px -2px #00eaff" : "none",
              transform: glitching ? "translate(2px, 2px)" : "none",
            }}
            variants={itemVariants}
          >
            {translations.title[currentLanguage]}
          </motion.h1>

          <motion.p
            className={`text-xl md:text-2xl mb-12 text-muted-foreground transition-all duration-100 ${
              glitching ? "text-glitch" : ""
            }`}
            style={{
              textShadow: glitching ? "1px 1px #ff00ea, -1px -1px #00eaff" : "none",
              transform: glitching ? "translate(1px, 1px)" : "none",
            }}
            variants={itemVariants}
          >
            {translations.subtitle[currentLanguage]}
          </motion.p>

          <motion.div className="space-y-6" variants={containerVariants}>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="text-lg px-8 py-6" onClick={navigateToDashboard}>
                {translations.cta[currentLanguage]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div className="text-sm text-muted-foreground mt-8" variants={itemVariants}>
              <p>Track your health • Manage medications • Schedule appointments</p>
              <p>Chat with AI assistant • Journal your health journey</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer className="p-4 text-center text-sm text-muted-foreground" variants={itemVariants}>
        <p>© {new Date().getFullYear()} Healthcare Assistant. All rights reserved.</p>
      </motion.footer>

      {/* CSS for glitch effect */}
      <style jsx global>{`
        @keyframes glitch {
          0% {
            text-shadow: 2px 2px #ff00ea, -2px -2px #00eaff;
            transform: translate(2px, 2px);
          }
          25% {
            text-shadow: -2px 2px #ff00ea, 2px -2px #00eaff;
            transform: translate(-2px, 2px);
          }
          50% {
            text-shadow: 2px -2px #ff00ea, -2px 2px #00eaff;
            transform: translate(2px, -2px);
          }
          75% {
            text-shadow: -2px -2px #ff00ea, 2px 2px #00eaff;
            transform: translate(-2px, -2px);
          }
          100% {
            text-shadow: 2px 2px #ff00ea, -2px -2px #00eaff;
            transform: translate(2px, 2px);
          }
        }
        
        .text-glitch {
          animation: glitch 0.15s infinite;
        }
      `}</style>
    </motion.div>
  )
}


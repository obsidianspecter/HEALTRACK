"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowRight } from "lucide-react"

const translations = {
  title: {
    english: "FemCare",
    spanish: "FemCuidado",
    french: "FemSoin",
    german: "FemPflege",
    chinese: "女性关爱",
    japanese: "フェムケア",
    arabic: "فيم كير",
    hindi: "फेमकेयर",
    russian: "ФемКер",
  } as const,
  subtitle: {
    english: "Your personal women's health companion",
    spanish: "Tu compañera personal de salud femenina",
    french: "Votre compagne de santé féminine personnelle",
    german: "Ihre persönliche Frauengesundheitsbegleiterin",
    chinese: "您的个人女性健康伴侣",
    japanese: "あなたの女性向けヘルスケアパートナー",
    arabic: "رفيقتك الشخصية للعناية بصحة المرأة",
    hindi: "आपका व्यक्तिगत महिला स्वास्थ्य साथी",
    russian: "Ваш личный помощник по женскому здоровью",
  },
  features: {
    english: ["Period Tracking", "Health Monitoring", "AI Assistant", "Appointment Scheduling"],
    spanish: ["Seguimiento del Período", "Monitoreo de Salud", "Asistente IA", "Programación de Citas"],
    french: ["Suivi des Règles", "Surveillance de la Santé", "Assistant IA", "Prise de Rendez-vous"],
    german: ["Periodenverfolgung", "Gesundheitsüberwachung", "KI-Assistent", "Terminplanung"],
    chinese: ["经期跟踪", "健康监测", "AI助手", "预约安排"],
    japanese: ["生理周期管理", "健康管理", "AIアシスタント", "予約管理"],
    arabic: ["تتبع الدورة", "مراقبة الصحة", "مساعد الذكاء الاصطناعي", "جدولة المواعيد"],
    hindi: ["मासिक धर्म ट्रैकिंग", "स्वास्थ्य निगरानी", "एआई सहायक", "अपॉइंटमेंट शेड्यूलिंग"],
    russian: ["Отслеживание Цикла", "Мониторинг Здоровья", "ИИ Ассистент", "Планирование Встреч"],
  },
  dashboard: {
    english: {
      overview: "Dashboard Overview",
      chatAssistant: "AI Health Assistant",
      medications: "Medication Tracker",
      appointments: "Appointment Scheduler",
      journal: "Health Journal",
      settings: "Settings",
      backToHome: "Back to Home",
      myAccount: "My Account",
      profileSettings: "Profile Settings",
      helpSupport: "Help & Support",
      logout: "Log out",
      upcomingEvents: "Your health metrics and upcoming events",
      nextAppointments: "Your next scheduled appointments",
      noAppointments: "No upcoming appointments",
      scheduleAppointment: "Schedule your next appointment",
      viewAllAppointments: "View All Appointments",
      trackPeriod: "Track your menstrual cycle",
      startTracking: "Start tracking your cycle",
      monitorCycle: "Monitor your cycle and symptoms",
      viewPeriodTracker: "View Period Tracker",
      viewMedicationTracker: "View Medication Tracker",
      noJournalEntries: "No journal entries yet",
      startJournal: "Start your health journal journey",
      viewJournal: "View Journal",
      aiDescription: "Get personalized health advice and answers to your questions",
      chatWithAssistant: "Chat with Assistant",
      manageAccount: "Manage your account information and preferences",
      fullName: "Full Name",
      enterName: "Enter your name",
      email: "Email",
      enterEmail: "Enter your email",
      age: "Age",
      enterAge: "Enter your age",
      height: "Height (cm)",
      enterHeight: "Enter your height",
      weight: "Weight (kg)",
      enterWeight: "Enter your weight",
      bloodType: "Blood Type",
      selectBloodType: "Select blood type",
      medicalConditions: "Medical Conditions",
      conditionsPlaceholder: "List any chronic conditions, allergies, etc.",
      saveChanges: "Save Changes",
      yourName: "Your Name",
      avatars: "Avatars",
      you: "You",
      assistant: "Assistant",
      generateNew: "Generate New",
      language: "Language",
      selectLanguage: "Select language",
      clearChat: "Clear Chat History",
      aiAssistant: "FemCare Assistant",
      connected: "Connected",
      disconnected: "Disconnected",
      typeHealthQuestion: "Type your health question...",
    },
    spanish: {
      overview: "Resumen del Panel",
      chatAssistant: "Asistente de Salud IA",
      medications: "Control de Medicamentos",
      appointments: "Programador de Citas",
      journal: "Diario de Salud",
      settings: "Configuración",
      backToHome: "Volver al Inicio",
      myAccount: "Mi Cuenta",
      profileSettings: "Configuración de Perfil",
      helpSupport: "Ayuda y Soporte",
      logout: "Cerrar Sesión",
      upcomingEvents: "Tus métricas de salud y próximos eventos",
      nextAppointments: "Tus próximas citas",
      noAppointments: "No hay citas próximas",
      scheduleAppointment: "Programa tu próxima cita",
      viewAllAppointments: "Ver Todas las Citas",
      trackPeriod: "Seguimiento del ciclo menstrual",
      startTracking: "Comienza a seguir tu ciclo",
      monitorCycle: "Monitorea tu ciclo y síntomas",
      viewPeriodTracker: "Ver Seguimiento de Período",
      viewMedicationTracker: "Ver Control de Medicamentos",
      noJournalEntries: "Aún no hay entradas en el diario",
      startJournal: "Comienza tu viaje en el diario de salud",
      viewJournal: "Ver Diario",
      aiDescription: "Obtén consejos de salud personalizados y respuestas a tus preguntas",
      chatWithAssistant: "Chatear con el Asistente",
      manageAccount: "Administra tu información y preferencias de cuenta",
      fullName: "Nombre Completo",
      enterName: "Ingresa tu nombre",
      email: "Correo Electrónico",
      enterEmail: "Ingresa tu correo",
      age: "Edad",
      enterAge: "Ingresa tu edad",
      height: "Altura (cm)",
      enterHeight: "Ingresa tu altura",
      weight: "Peso (kg)",
      enterWeight: "Ingresa tu peso",
      bloodType: "Tipo de Sangre",
      selectBloodType: "Selecciona tipo de sangre",
      medicalConditions: "Condiciones Médicas",
      conditionsPlaceholder: "Lista condiciones crónicas, alergias, etc.",
      saveChanges: "Guardar Cambios",
      yourName: "Tu Nombre",
      avatars: "Avatares",
      you: "Tú",
      assistant: "Asistente",
      generateNew: "Generar Nuevo",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma",
      clearChat: "Borrar Historial de Chat",
      aiAssistant: "Asistente FemCare",
      connected: "Conectado",
      disconnected: "Desconectado",
      typeHealthQuestion: "Escribe tu pregunta de salud...",
    },
    french: {
      overview: "Vue d'ensemble",
      chatAssistant: "Assistant Santé IA",
      medications: "Suivi des Médicaments",
      appointments: "Planificateur de Rendez-vous",
      journal: "Journal de Santé",
      settings: "Paramètres du Compte",
      backToHome: "Retour à l'Accueil",
      myAccount: "Mon Compte",
      profileSettings: "Paramètres du Profil",
      helpSupport: "Aide et Support",
      logout: "Déconnexion",
      upcomingEvents: "Vos métriques de santé et événements à venir",
      nextAppointments: "Vos prochains rendez-vous",
      noAppointments: "Aucun rendez-vous à venir",
      scheduleAppointment: "Planifiez votre prochain rendez-vous pour le voir ici",
      viewAllAppointments: "Voir Tous les Rendez-vous",
      trackPeriod: "Suivi des règles",
      startTracking: "Commencez à suivre vos règles",
      monitorCycle: "Surveillez votre cycle et vos symptômes",
      viewPeriodTracker: "Voir le Suivi des Règles",
      noJournalEntries: "Aucune entrée dans le journal",
      startJournal: "Commencez à suivre votre parcours santé aujourd'hui",
      viewJournal: "Voir le Journal",
      aiDescription: "Notre assistant IA peut vous aider à répondre aux questions sur la santé féminine, vérifier les symptômes ou recommander des spécialistes.",
      chatWithAssistant: "Discuter avec l'Assistant",
      manageAccount: "Gérez vos informations et préférences de compte",
      fullName: "Nom Complet",
      enterName: "Entrez votre nom",
      email: "Email",
      enterEmail: "Entrez votre email",
      age: "Âge",
      enterAge: "Entrez votre âge",
      height: "Taille (cm)",
      enterHeight: "Entrez votre taille",
      weight: "Poids (kg)",
      enterWeight: "Entrez votre poids",
      bloodType: "Groupe Sanguin",
      selectBloodType: "Sélectionnez groupe sanguin",
      medicalConditions: "Conditions Médicales",
      conditionsPlaceholder: "Listez les conditions chroniques, allergies, etc.",
      saveChanges: "Enregistrer les Modifications",
      yourName: "Votre Nom",
      avatars: "Avatars",
      you: "Vous",
      assistant: "Assistant",
      generateNew: "Générer Nouveau",
      language: "Langue",
      selectLanguage: "Sélectionner la langue",
      clearChat: "Effacer l'Historique de Chat",
      aiAssistant: "Assistant FemCare",
      connected: "Connecté",
      disconnected: "Déconnecté",
      typeHealthQuestion: "Écrivez votre question de santé...",
    },
    german: {
      overview: "Übersicht",
      chatAssistant: "KI-Gesundheitsassistent",
      medications: "Medikamenten-Tracker",
      appointments: "Terminplaner",
      journal: "Gesundheitstagebuch",
      settings: "Kontoeinstellungen",
      backToHome: "Zurück zur Startseite",
      myAccount: "Mein Konto",
      profileSettings: "Profileinstellungen",
      helpSupport: "Hilfe & Support",
      logout: "Abmelden",
      upcomingEvents: "Ihre Gesundheitswerte und anstehende Ereignisse",
      nextAppointments: "Ihre nächsten Termine",
      noAppointments: "Keine anstehenden Termine",
      scheduleAppointment: "Planen Sie Ihren nächsten Termin, um ihn hier zu sehen",
      viewAllAppointments: "Alle Termine anzeigen",
      trackPeriod: "Periodenverfolgung",
      startTracking: "Beginnen Sie mit der Periodenverfolgung",
      monitorCycle: "Überwachen Sie Ihren Zyklus und Symptome",
      viewPeriodTracker: "Periodentracker anzeigen",
      noJournalEntries: "Keine Tagebucheinträge",
      startJournal: "Beginnen Sie heute mit der Aufzeichnung Ihrer Gesundheitsreise",
      viewJournal: "Tagebuch anzeigen",
      aiDescription: "Unser KI-Assistent kann Ihnen bei Fragen zur Frauengesundheit helfen, Symptome überprüfen oder Spezialisten empfehlen.",
      chatWithAssistant: "Mit Assistent chatten",
      manageAccount: "Verwalten Sie Ihre Kontoinformationen und Einstellungen",
      fullName: "Vollständiger Name",
      enterName: "Namen eingeben",
      email: "E-Mail",
      enterEmail: "E-Mail eingeben",
      age: "Alter",
      enterAge: "Alter eingeben",
      height: "Größe (cm)",
      enterHeight: "Größe eingeben",
      weight: "Gewicht (kg)",
      enterWeight: "Gewicht eingeben",
      bloodType: "Blutgruppe",
      selectBloodType: "Blutgruppe auswählen",
      medicalConditions: "Medizinische Bedingungen",
      conditionsPlaceholder: "Chronische Erkrankungen, Allergien etc. auflisten",
      saveChanges: "Änderungen speichern",
      yourName: "Ihr Name",
      avatars: "Avatare",
      you: "Sie",
      assistant: "Assistent",
      generateNew: "Neue Generieren",
      language: "Sprache",
      selectLanguage: "Sprache auswählen",
      clearChat: "Chat-Verlauf löschen",
      aiAssistant: "FemCare-Assistent",
      connected: "Verbunden",
      disconnected: "Getrennt",
      typeHealthQuestion: "Geben Sie Ihre Gesundheitsfrage ein...",
    },
    chinese: {
      overview: "仪表板概览",
      chatAssistant: "AI健康助手",
      medications: "用药追踪",
      appointments: "预约安排",
      journal: "健康日记",
      settings: "账户设置",
      backToHome: "返回首页",
      myAccount: "我的账户",
      profileSettings: "个人资料设置",
      helpSupport: "帮助与支持",
      logout: "退出登录",
      upcomingEvents: "您的健康指标和即将到来的事件",
      nextAppointments: "您的下一个预约",
      noAppointments: "暂无预约",
      scheduleAppointment: "安排您的下一个预约以在此处查看",
      viewAllAppointments: "查看所有预约",
      trackPeriod: "经期追踪",
      startTracking: "开始追踪您的经期",
      monitorCycle: "监测您的周期和症状",
      viewPeriodTracker: "查看经期追踪器",
      viewMedicationTracker: "查看用药追踪器",
      noJournalEntries: "暂无日记记录",
      startJournal: "今天开始记录您的健康之旅",
      viewJournal: "查看日记",
      aiDescription: "我们的AI助手可以帮助回答女性健康问题，检查症状或推荐专家。",
      chatWithAssistant: "与助手聊天",
      manageAccount: "管理您的账户信息和偏好设置",
      fullName: "全名",
      enterName: "输入您的姓名",
      email: "电子邮件",
      enterEmail: "输入您的电子邮件",
      age: "年龄",
      enterAge: "输入您的年龄",
      height: "身高 (厘米)",
      enterHeight: "输入您的身高",
      weight: "体重 (公斤)",
      enterWeight: "输入您的体重",
      bloodType: "血型",
      selectBloodType: "选择血型",
      medicalConditions: "医疗状况",
      conditionsPlaceholder: "列出任何慢性病、过敏等",
      saveChanges: "保存更改",
      yourName: "您的姓名",
      avatars: "头像",
      you: "您",
      assistant: "助手",
      generateNew: "生成新",
      language: "语言",
      selectLanguage: "选择语言",
      clearChat: "清除聊天记录",
      aiAssistant: "FemCare助手",
      connected: "已连接",
      disconnected: "已断开",
      typeHealthQuestion: "输入健康问题...",
    },
    japanese: {
      overview: "ダッシュボード概要",
      chatAssistant: "AIヘルスアシスタント",
      medications: "服薬管理",
      appointments: "予約管理",
      journal: "健康日記",
      settings: "アカウント設定",
      backToHome: "ホームに戻る",
      myAccount: "マイアカウント",
      profileSettings: "プロフィール設定",
      helpSupport: "ヘルプ＆サポート",
      logout: "ログアウト",
      upcomingEvents: "あなたの健康指標と今後のイベント",
      nextAppointments: "次回の予約",
      noAppointments: "予約はありません",
      scheduleAppointment: "次回の予約を入れると、ここに表示されます",
      viewAllAppointments: "すべての予約を表示",
      trackPeriod: "生理周期管理",
      startTracking: "生理の記録を開始",
      monitorCycle: "周期と症状を監視",
      viewPeriodTracker: "生理トラッカーを表示",
      viewMedicationTracker: "服薬トラッカーを表示",
      noJournalEntries: "日記の記録はありません",
      startJournal: "今日から健康の記録を始めましょう",
      viewJournal: "日記を表示",
      aiDescription: "AIアシスタントが女性の健康に関する質問に答え、症状をチェックし、専門医を推薦します。",
      chatWithAssistant: "アシスタントとチャット",
      manageAccount: "アカウント情報と設定を管理",
      fullName: "氏名",
      enterName: "名前を入力",
      email: "メールアドレス",
      enterEmail: "メールアドレスを入力",
      age: "年齢",
      enterAge: "年齢を入力",
      height: "身長 (cm)",
      enterHeight: "身長を入力",
      weight: "体重 (kg)",
      enterWeight: "体重を入力",
      bloodType: "血液型",
      selectBloodType: "血液型を選択",
      medicalConditions: "健康状態",
      conditionsPlaceholder: "慢性疾患、アレルギーなどを記入",
      saveChanges: "変更を保存",
      yourName: "お名前",
      avatars: "アバター",
      you: "あなた",
      assistant: "アシスタント",
      generateNew: "新規作成",
      language: "言語",
      selectLanguage: "言語を選択",
      clearChat: "チャット履歴をクリア",
      aiAssistant: "FemCareアシスタント",
      connected: "接続済み",
      disconnected: "切断済み",
      typeHealthQuestion: "健康に関する質問を入力...",
    },
    arabic: {
      overview: "نظرة عامة على لوحة التحكم",
      chatAssistant: "مساعد الصحة الذكي",
      medications: "متتبع الأدوية",
      appointments: "جدولة المواعيد",
      journal: "يومية الصحة",
      settings: "إعدادات الحساب",
      backToHome: "العودة إلى الرئيسية",
      myAccount: "حسابي",
      profileSettings: "إعدادات الملف الشخصي",
      helpSupport: "المساعدة والدعم",
      logout: "تسجيل الخروج",
      upcomingEvents: "مؤشراتك الصحية والأحداث القادمة",
      nextAppointments: "مواعيدك القادمة",
      noAppointments: "لا توجد مواعيد قادمة",
      scheduleAppointment: "حدد موعدك القادم ليظهر هنا",
      viewAllAppointments: "عرض جميع المواعيد",
      trackPeriod: "تتبع الدورة الشهرية",
      startTracking: "ابدأي بتتبع دورتك الشهرية",
      monitorCycle: "راقبي دورتك وأعراضك",
      viewPeriodTracker: "عرض متتبع الدورة",
      viewMedicationTracker: "عرض متتبع الأدوية",
      noJournalEntries: "لا توجد مدخلات في اليومية",
      startJournal: "ابدأي بتتبع رحلتك الصحية اليوم",
      viewJournal: "عرض اليومية",
      aiDescription: "يمكن لمساعدنا الذكي المساعدة في الإجابة عن أسئلة صحة المرأة، وفحص الأعراض، أو التوصية بالمتخصصين.",
      chatWithAssistant: "الدردشة مع المساعد",
      manageAccount: "إدارة معلومات حسابك وتفضيلاتك",
      fullName: "الاسم الكامل",
      enterName: "أدخل اسمك",
      email: "البريد الإلكتروني",
      enterEmail: "أدخل بريدك الإلكتروني",
      age: "العمر",
      enterAge: "أدخل عمرك",
      height: "الطول (سم)",
      enterHeight: "أدخل طولك",
      weight: "الوزن (كجم)",
      enterWeight: "أدخل وزنك",
      bloodType: "فصيلة الدم",
      selectBloodType: "اختر فصيلة الدم",
      medicalConditions: "الحالات الطبية",
      conditionsPlaceholder: "اذكر أي حالات مزمنة، حساسية، إلخ",
      saveChanges: "حفظ التغييرات",
      yourName: "اسمك",
      avatars: "الصور الشخصية",
      you: "أنت",
      assistant: "المساعد",
      generateNew: "إنشاء جديد",
      language: "اللغة",
      selectLanguage: "اختر اللغة",
      clearChat: "مسح تاريخ الدردشة",
      aiAssistant: "مساعد FemCare",
      connected: "متصل",
      disconnected: "مفصول",
      typeHealthQuestion: "أدخل سؤال صحي...",
    },
    hindi: {
      overview: "डैशबोर्ड अवलोकन",
      chatAssistant: "एआई स्वास्थ्य सहायक",
      medications: "दवा ट्रैकर",
      appointments: "अपॉइंटमेंट शेड्यूलर",
      journal: "स्वास्थ्य जर्नल",
      settings: "खाता सेटिंग्स",
      backToHome: "होम पर वापस जाएं",
      myAccount: "मेरा खाता",
      profileSettings: "प्रोफ़ाइल सेटिंग्स",
      helpSupport: "सहायता और समर्थन",
      logout: "लॉग आउट",
      upcomingEvents: "आपके स्वास्थ्य मैट्रिक्स और आगामी कार्यक्रम",
      nextAppointments: "आपकी अगली अपॉइंटमेंट",
      noAppointments: "कोई आगामी अपॉइंटमेंट नहीं",
      scheduleAppointment: "अपनी अगली अपॉइंटमेंट शेड्यूल करें",
      viewAllAppointments: "सभी अपॉइंटमेंट देखें",
      trackPeriod: "मासिक धर्म ट्रैकिंग",
      startTracking: "अपने मासिक धर्म को ट्रैक करना शुरू करें",
      monitorCycle: "अपने चक्र और लक्षणों की निगरानी करें",
      viewPeriodTracker: "पीरियड ट्रैकर देखें",
      viewMedicationTracker: "दवा ट्रैकर देखें",
      noJournalEntries: "कोई जर्नल एंट्री नहीं",
      startJournal: "आज से अपनी स्वास्थ्य यात्रा को ट्रैक करें",
      viewJournal: "जर्नल देखें",
      aiDescription: "हमारा एआई सहायक महिलाओं के स्वास्थ्य संबंधी प्रश्नों का उत्तर देने, लक्षणों की जांच करने या विशेषज्ञों की सिफारिश करने में मदद कर सकता है।",
      chatWithAssistant: "सहायक से चैट करें",
      manageAccount: "अपनी खाता जानकारी और प्राथमिकताएं प्रबंधित करें",
      fullName: "पूरा नाम",
      enterName: "अपना नाम दर्ज करें",
      email: "ईमेल",
      enterEmail: "अपना ईमेल दर्ज करें",
      age: "आयु",
      enterAge: "अपनी आयु दर्ज करें",
      height: "ऊंचाई (सेमी)",
      enterHeight: "अपनी ऊंचाई दर्ज करें",
      weight: "वजन (किग्रा)",
      enterWeight: "अपना वजन दर्ज करें",
      bloodType: "रक्त समूह",
      selectBloodType: "रक्त समूह चुनें",
      medicalConditions: "चिकित्सा स्थितियां",
      conditionsPlaceholder: "किसी भी पुरानी बीमारी, एलर्जी आदि की सूची बनाएं",
      saveChanges: "परिवर्तन सहेजें",
      yourName: "आपका नाम",
      avatars: "आवारे",
      you: "आप",
      assistant: "सहायक",
      generateNew: "नया बनाएं",
      language: "भाषा",
      selectLanguage: "भाषा चुनें",
      clearChat: "चैट इतिहास साफ़ करें",
      aiAssistant: "FemCare सहायक",
      connected: "कनेक्टेड",
      disconnected: "डिस्कनेक्टेड",
      typeHealthQuestion: "स्वास्थ्य प्रश्न टाइप करें...",
    },
    russian: {
      overview: "Обзор Панели",
      chatAssistant: "ИИ Помощник по Здоровью",
      medications: "Отслеживание Лекарств",
      appointments: "Планировщик Встреч",
      journal: "Дневник Здоровья",
      settings: "Настройки Аккаунта",
      backToHome: "Вернуться на Главную",
      myAccount: "Мой Аккаунт",
      profileSettings: "Настройки Профиля",
      helpSupport: "Помощь и Поддержка",
      logout: "Выйти",
      upcomingEvents: "Ваши показатели здоровья и предстоящие события",
      nextAppointments: "Ваши следующие встречи",
      noAppointments: "Нет предстоящих встреч",
      scheduleAppointment: "Запланируйте следующую встречу, чтобы увидеть её здесь",
      viewAllAppointments: "Просмотреть Все Встречи",
      trackPeriod: "Отслеживание Менструации",
      startTracking: "Начните отслеживать свой цикл",
      monitorCycle: "Отслеживайте свой цикл и симптомы",
      viewPeriodTracker: "Просмотр Трекера Цикла",
      viewMedicationTracker: "Просмотр Трекера Лекарств",
      noJournalEntries: "Нет записей в дневнике",
      startJournal: "Начните отслеживать свой путь к здоровью сегодня",
      viewJournal: "Просмотр Дневника",
      aiDescription: "Наш ИИ-помощник может помочь ответить на вопросы о женском здоровье, проверить симптомы или порекомендовать специалистов.",
      chatWithAssistant: "Общаться с Помощником",
      manageAccount: "Управляйте информацией и настройками вашего аккаунта",
      fullName: "Полное Имя",
      enterName: "Введите ваше имя",
      email: "Эл. почта",
      enterEmail: "Введите вашу эл. почту",
      age: "Возраст",
      enterAge: "Введите ваш возраст",
      height: "Рост (см)",
      enterHeight: "Введите ваш рост",
      weight: "Вес (кг)",
      enterWeight: "Введите ваш вес",
      bloodType: "Группа Крови",
      selectBloodType: "Выберите группу крови",
      medicalConditions: "Медицинские Условия",
      conditionsPlaceholder: "Перечислите хронические заболевания, аллергии и т.д.",
      saveChanges: "Сохранить Изменения",
      yourName: "Ваше Имя",
      avatars: "Аватары",
      you: "Вы",
      assistant: "Помощник",
      generateNew: "Создать Новый",
      language: "Язык",
      selectLanguage: "Выберите язык",
      clearChat: "Очистить История Чата",
      aiAssistant: "Помощник FemCare",
      connected: "Подключен",
      disconnected: "Отключен",
      typeHealthQuestion: "Введите вопрос о здоровье...",
    }
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
  languageNames: {
    english: "English",
    spanish: "Español",
    french: "Français",
    german: "Deutsch",
    chinese: "中文",
    japanese: "日本語",
    arabic: "العربية",
    hindi: "हिंदी",
    russian: "Русский",
  }
} as const

export { translations }

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
        <p>© {new Date().getFullYear()} FemCare. All rights reserved.</p>
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


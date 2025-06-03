"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Calendar, User, Bot, X } from "lucide-react"
import { PDFViewer } from "@/components/assignment/pdf-viewer"

// Mock data for submitted assignments
const submittedFiles = [
  {
    id: 1,
    fileName: "Tugas_Matematika_John.pdf",
    studentName: "John Doe",
    assignmentTitle: "Aljabar Linear",
    submitDate: "2024-01-15",
    status: "submitted",
    fileUrl: "https://alwocqtpmrlfebnjjtct.supabase.co/storage/v1/object/public/Kumpulin/Praktikum%20DNS%20Server/2%20SDT%20%20B/Laprak(2)_BasicCMDofLinux_46.pdf",
  },
  {
    id: 2,
    fileName: "Essay_Bahasa_Jane.pdf",
    studentName: "Jane Smith",
    assignmentTitle: "Analisis Puisi",
    submitDate: "2024-01-14",
    status: "reviewed",
    fileUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
  {
    id: 3,
    fileName: "Laporan_Fisika_Bob.pdf",
    studentName: "Bob Wilson",
    assignmentTitle: "Eksperimen Gerak",
    submitDate: "2024-01-13",
    status: "submitted",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 4,
    fileName: "Tugas_Kimia_Alice.pdf",
    studentName: "Alice Brown",
    assignmentTitle: "Reaksi Kimia",
    submitDate: "2024-01-12",
    status: "graded",
    fileUrl: "https://www.africau.edu/images/default/sample.pdf",
  },
]

export default function Dashboard() {
  const params = useParams()
  const folderName = params.folderName as string
  
  // Convert URL-friendly name back to display name
  const displayName = folderName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'
  
  const [selectedFile, setSelectedFile] = useState(submittedFiles[0])
  const [showAIPrompt, setShowAIPrompt] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "graded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Dikumpulkan"
      case "reviewed":
        return "Direview"
      case "graded":
        return "Dinilai"
      default:
        return "Unknown"
    }
  }

  return (
    <SidebarInset>      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{displayName}</h1>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Section - File List (30%) */}
        <div className="w-[30%] border-r bg-muted/20">
            <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">{submittedFiles.length} Tugas Terkumpul</h2>
              <p className="text-xs text-muted-foreground">3 mengumpulkan tepat waktu</p>
              <p className="text-xs text-muted-foreground">1 mengumpulkan terlambat</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/submission"}>
              Pengumpulan tugas
            </Button>
            </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2 space-y-2">
              {submittedFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedFile.id === file.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedFile(file)
                    setShowAIPrompt(true)
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.fileName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{file.studentName}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{file.submitDate}</p>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(file.status)}`}>
                            {getStatusText(file.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Section - PDF Preview (70%) */}
        <div className="flex-1 relative">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{selectedFile.assignmentTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedFile.fileName} - {selectedFile.studentName}
            </p>
          </div>          {/* PDF Preview Area */}
          <div className="h-[calc(100vh-12rem)]">
            <PDFViewer 
              url={selectedFile.fileUrl} 
              className="w-full h-full"
            />
          </div>

          {/* Floating AI Prompt (Red Box) */}
          {showAIPrompt && (
            <div className="absolute top-20 right-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Bot className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Koreksi dengan AI?</p>
                    <p className="text-sm text-red-600 mt-1">
                      Apakah Anda ingin menggunakan AI untuk mengoreksi tugas ini?
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIPrompt(false)}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    // Handle AI correction
                    setShowAIPrompt(false)
                    // Add AI correction logic here
                  }}
                >
                  Ya, Koreksi
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAIPrompt(false)}>
                  Tidak
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}

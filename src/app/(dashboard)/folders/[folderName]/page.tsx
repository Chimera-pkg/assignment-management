"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { FileText, Calendar, User, Bot, X, Edit, Loader2 } from "lucide-react"
import { PDFViewer } from "@/components/assignment/pdf-viewer"
import { generateAIFeedback } from "@/actions/feedback"
import { submitGrade } from "@/actions/grading"

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
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [correction, setCorrection] = useState("")
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

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
  const handleGradeSubmit = async () => {
    try {
      const result = await submitGrade({
        studentName: selectedFile.studentName,
        fileName: selectedFile.fileName,
        assignmentTitle: selectedFile.assignmentTitle,
        grade,
        correction
      })

      if (result.success) {
        console.log("Grade submitted successfully:", result.message)
        setIsGradeModalOpen(false)
        setGrade("")
        setCorrection("")
        // You can add a toast notification here if needed
      } else {
        console.error("Failed to submit grade:", result.error)
        // You can add error handling UI here
      }
    } catch (error) {
      console.error("Error submitting grade:", error)
      // You can add error handling UI here
    }
  }

  const handleGenerateAIFeedback = async () => {
    setIsGeneratingFeedback(true)
    
    try {
      const result = await generateAIFeedback({
        title: selectedFile.assignmentTitle,
        studentName: selectedFile.studentName,
        fileName: selectedFile.fileName
      })

      if (result.success && result.feedback) {
        setCorrection(result.feedback)
      } else {
        setCorrection(`Error generating AI feedback: ${result.error}. Please try again.`)
      }
    } catch (error) {
      console.error("Error generating AI feedback:", error)
      setCorrection(`Error generating AI feedback: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsGeneratingFeedback(false)
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
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{selectedFile.assignmentTitle}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedFile.fileName} - {selectedFile.studentName}
              </p>
            </div>
            
            {/* Grade Modal Button */}
            <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Beri Nilai
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Beri Nilai dan Koreksi</DialogTitle>
                  <DialogDescription>
                    Berikan nilai dan koreksi untuk tugas {selectedFile.studentName}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">
                      Nilai
                    </Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="correction" className="text-right mt-2">
                      Koreksi
                    </Label>
                    <Textarea
                      id="correction"
                      placeholder="Masukkan koreksi dan feedback..."
                      value={correction}
                      onChange={(e) => setCorrection(e.target.value)}
                      className="col-span-3 min-h-[100px]"
                    />
                  </div>
                </div>                <DialogFooter>
                  <Button variant='outline' onClick={handleGradeSubmit}>Simpan</Button>
                  <Button 
                    onClick={handleGenerateAIFeedback}
                    disabled={isGeneratingFeedback}
                  >
                    {isGeneratingFeedback && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isGeneratingFeedback ? "Generating..." : "Generate AI Feedback"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>          {/* PDF Preview Area */}
          <div className="h-[calc(100vh-12rem)]">
            <PDFViewer 
              url={selectedFile.fileUrl} 
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

"use client"

import { useState, useEffect } from "react"
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
import { FileText, Calendar, User, Bot, X, Edit, Loader2, Mail } from "lucide-react"
import { PDFViewer } from "@/components/assignment/pdf-viewer"
import { generateAIFeedback } from "@/actions/feedback"
import { submitGrade, sendFeedbackEmail } from "@/actions/grading"
import { getDocumentsByFolder } from "@/actions/documents"
import type { DocumentData } from "@/actions/documents"

export default function Dashboard() {
  const params = useParams()
  const folderName = params.folderName as string
  
  const displayName = folderName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'
  const [submittedFiles, setSubmittedFiles] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<DocumentData | null>(null)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [correction, setCorrection] = useState("")
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [folderName])

  useEffect(() => {
    if (selectedFile) {
      setGrade(selectedFile.grade || "")
      setCorrection(selectedFile.feedback || "")
    }
  }, [selectedFile])

  const loadDocuments = async () => {
    if (!folderName) return
    
    setLoading(true)
    try {
      const decodedFolderName = decodeURIComponent(folderName)
      const documents = await getDocumentsByFolder(decodedFolderName)
      setSubmittedFiles(documents)
      if (documents.length > 0 && !selectedFile) {
        setSelectedFile(documents[0])
      }
    } catch (error) {
      console.error("Error loading documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (hasGrade: boolean, hasFeedback: boolean) => {
    if (hasGrade && hasFeedback) return "bg-green-100 text-green-800"
    if (hasFeedback) return "bg-yellow-100 text-yellow-800"
    return "bg-blue-100 text-blue-800"
  }

  const getStatusText = (hasGrade: boolean, hasFeedback: boolean) => {
    if (hasGrade && hasFeedback) return "Dinilai"
    if (hasFeedback) return "Direview"
    return "Dikumpulkan"
  }

  const handleGradeSubmit = async () => {
    if (!selectedFile) return
    
    try {
      const result = await submitGrade({
        documentId: selectedFile.id,
        grade,
        correction
      })

      if (result.success) {
        console.log("Grade submitted successfully:", result.message)
        setIsGradeModalOpen(false)
        await loadDocuments()
      } else {
        console.error("Failed to submit grade:", result.error)
      }
    } catch (error) {
      console.error("Error submitting grade:", error)
    }
  }

  const handleGenerateAIFeedback = async () => {
    if (!selectedFile) return
    
    setIsGeneratingFeedback(true)
    
    try {
      const result = await generateAIFeedback({
        title: selectedFile.folder || "Assignment",
        studentName: selectedFile.name_student,
        fileName: selectedFile.document_name
      })

      if (result.success && result.feedback) {
        setCorrection(result.feedback)
      } else {
        setCorrection(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error generating AI feedback:", error)
      setCorrection(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedFile || !selectedFile.email) {
      alert("Email siswa tidak ditemukan")
      return
    }
    
    setIsSendingEmail(true)
    
    try {
      const result = await sendFeedbackEmail({
        documentId: selectedFile.id,
        studentEmail: selectedFile.email,
        studentName: selectedFile.name_student,
        assignmentTitle: selectedFile.folder || "Assignment",
        feedback: correction,
        grade: grade || undefined
      })

      if (result.success) {
        alert("Email berhasil dikirim!")
      } else {
        alert(`Gagal mengirim email: ${result.error}`)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Gagal mengirim email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{displayName}</h1>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading documents...</span>
        </div>
      </SidebarInset>
    )
  }

  if (!selectedFile) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{displayName}</h1>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <p>No documents found in this folder.</p>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
              <p className="text-xs text-muted-foreground">Daftar tugas yang dikumpulkan</p>
            </div>
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
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.document_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <User className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{file.name_student}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {new Date(file.uploaded_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(!!file.grade, !!file.feedback)}`}>
                            {getStatusText(!!file.grade, !!file.feedback)}
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
              <h3 className="font-semibold">{selectedFile.folder || "Assignment"}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedFile.document_name} - {selectedFile.name_student}
              </p>
            </div>
            
            <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Beri Nilai
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Beri Nilai dan Koreksi</DialogTitle>
                  <DialogDescription>
                    Berikan nilai dan koreksi untuk tugas {selectedFile.name_student}
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
                    <div className="col-span-3 space-y-2">
                      <Textarea
                        id="correction"
                        placeholder="Masukkan koreksi dan feedback..."
                        value={correction}
                        onChange={(e) => setCorrection(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateAIFeedback}
                        disabled={isGeneratingFeedback}
                        className="w-full"
                      >
                        {isGeneratingFeedback && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isGeneratingFeedback ? "Generating..." : "Generate AI Feedback"}
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button variant='outline' onClick={handleGradeSubmit}>
                    Simpan
                  </Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || !selectedFile.email}
                  >
                    {isSendingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Mail className="w-4 h-4 mr-2" />
                    {isSendingEmail ? "Sending..." : "Kirim Email"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="h-[calc(100vh-12rem)]">
            <PDFViewer 
              url={selectedFile.document_url} 
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

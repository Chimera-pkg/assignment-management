"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Calendar, User } from "lucide-react"
import { PDFViewer } from "@/components/assignment/pdf-viewer"
import { getDocumentsByFolder } from "@/actions/documents"
import type { DocumentData } from "@/actions/documents"
import GradingModal from "@/components/grading-modal"

export default function Dashboard() {
  const params = useParams()
  const router = useRouter()
  const folderName = params.folderName as string
    // Convert URL-friendly name back to display name
  const displayName = folderName?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'
  const [submittedFiles, setSubmittedFiles] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<DocumentData | null>(null)
  const [showAIPrompt, setShowAIPrompt] = useState(true)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [folderName])

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
      default:        return "Unknown"
    }
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
        setGrade("")
        setCorrection("")
        // Reload documents to show updated data
        await loadDocuments()
        // You can add a toast notification here if needed
      } else {
        console.error("Failed to submit grade:", result.error)
        // You can add error handling UI here
      }
    } catch (error) {      console.error("Error submitting grade:", error)
      // You can add error handling UI here
    }
  }

  const handleGenerateAIFeedback = async () => {
    if (!selectedFile) return
    
    setIsGeneratingFeedback(true)
    
    try {
      const result = await generateAIFeedback({
        title: selectedFile.folder || 'Assignment',
        studentName: selectedFile.name_student,
        fileName: selectedFile.document_name
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

  const handleSendEmail = async () => {
    if (!selectedFile || !correction.trim()) {
      console.error("No file selected or no feedback to send")
      return
    }

    setIsSendingEmail(true)
    
    try {      const result = await sendFeedbackEmail({
        documentId: selectedFile.id,
        studentEmail: selectedFile.email || `${selectedFile.name_student.toLowerCase().replace(/\s+/g, '.')}@student.example.com`, // Use database email or fallback
        studentName: selectedFile.name_student,
        assignmentTitle: selectedFile.folder || 'Assignment',
        feedback: correction,
        grade: grade
      })

      if (result.success) {
        console.log("Email sent successfully:", result.message)
        // You can add a toast notification here
      } else {
        console.error("Failed to send email:", result.error)
        // You can add error handling UI here
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setIsSendingEmail(false)
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
            </div>            <Button variant="outline" onClick={() => router.push(`/${encodeURIComponent(folderName)}/submit`)}>
              Pengumpulan tugas
            </Button>
            </div>

          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2 space-y-2">
              {submittedFiles.map((file) => (
                <Card
                  key={file.id}                  className={`cursor-pointer transition-colors hover:bg-accent ${
                    selectedFile?.id === file.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedFile(file)
                    setShowAIPrompt(true)
                  }}
                >                  <CardContent className="p-3">
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
                          <p className="text-xs text-muted-foreground">{new Date(file.uploaded_date).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(file.grade ? 'graded' : 'submitted')}`}>
                            {getStatusText(file.grade ? 'graded' : 'submitted')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>        {/* Right Section - PDF Preview (70%) */}
        <div className="flex-1 relative">
          {selectedFile && (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedFile.folder || 'Assignment'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile.document_name} - {selectedFile.name_student}
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
                  </div>                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="correction" className="text-right mt-2">
                      Koreksi
                    </Label>
                    <div className="col-span-3 relative">
                      <Textarea
                        id="correction"
                        placeholder="Masukkan koreksi dan feedback..."
                        value={correction}
                        onChange={(e) => setCorrection(e.target.value)}
                        className="min-h-[100px] pr-12"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        onClick={handleGenerateAIFeedback}
                        disabled={isGeneratingFeedback}
                        title="Generate AI Feedback"
                      >
                        {isGeneratingFeedback ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </Button>                    </div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleGradeSubmit}>
                    Simpan
                  </Button>
                  <Button 
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || !correction.trim()}
                    className="ml-2"
                  >
                    {isSendingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Mail className="w-4 h-4 mr-2" />
                    {isSendingEmail ? "Mengirim..." : "Kirim Email"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* PDF Preview Area */}
          <div className="h-[calc(100vh-12rem)]">
            <PDFViewer 
              url={selectedFile.document_url} 
              className="w-full h-full"
            />
          </div>
        </>
      )}
      {!selectedFile && (        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Select a file to preview</p>
        </div>
      )}
    </div>
  </div>
</SidebarInset>
  )
}

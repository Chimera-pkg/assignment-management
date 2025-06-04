"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Edit, Loader2, Mail, Bot } from "lucide-react"
import { generateAIFeedback } from "@/actions/feedback"
import { submitGrade, sendFeedbackEmail } from "@/actions/grading"
import type { DocumentData } from "@/actions/documents"

interface GradingModalProps {
  selectedFile: DocumentData | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onGradeSubmitted: () => void
}

export default function GradingModal({ selectedFile, isOpen, onOpenChange, onGradeSubmitted }: GradingModalProps) {
  const [grade, setGrade] = useState("")
  const [correction, setCorrection] = useState("")
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

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
        onOpenChange(false)
        setGrade("")
        setCorrection("")
        onGradeSubmitted()
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
    
    try {
      const result = await sendFeedbackEmail({
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

  if (!selectedFile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
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
              </Button>
            </div>
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
  )
}

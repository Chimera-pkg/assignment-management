"use client"

import type React from "react"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, CheckCircle } from "lucide-react"

// Mock data for available assignments
const availableAssignments = [
  { id: 1, title: "Aljabar Linear", deadline: "2024-01-20", subject: "Matematika" },
  { id: 2, title: "Analisis Puisi", deadline: "2024-01-22", subject: "Bahasa Indonesia" },
  { id: 3, title: "Eksperimen Gerak", deadline: "2024-01-25", subject: "Fisika" },
  { id: 4, title: "Reaksi Kimia", deadline: "2024-01-28", subject: "Kimia" },
]

export default function UploadSubmission() {
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [studentName, setStudentName] = useState("")
  const [notes, setNotes] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setUploadedFile(file)
      simulateUpload()
    } else {
      alert("Hanya file PDF yang diperbolehkan")
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssignment || !studentName || !uploadedFile) {
      alert("Mohon lengkapi semua field yang diperlukan")
      return
    }

    // Handle submission
    console.log("Submission:", {
      assignment: selectedAssignment,
      student: studentName,
      file: uploadedFile,
      notes,
    })

    // Reset form
    setSelectedAssignment("")
    setStudentName("")
    setNotes("")
    setUploadedFile(null)
    setUploadProgress(0)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Upload Pengumpulan Tugas</h1>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Form Pengumpulan Tugas</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pilih Tugas */}
                <div className="space-y-2">
                  <Label htmlFor="assignment">Pilih Tugas</Label>
                  <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tugas yang akan dikumpulkan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAssignments.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id.toString()}>
                          <div className="flex flex-col">
                            <span>{assignment.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {assignment.subject} - Deadline: {assignment.deadline}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nama Pengumpul */}
                <div className="space-y-2">
                  <Label htmlFor="student-name">Nama Pengumpul</Label>
                  <Input
                    id="student-name"
                    placeholder="Masukkan nama siswa..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>

                {/* File Upload Area */}
                <div className="space-y-2">
                  <Label>Upload File Tugas</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                  >
                    {uploadedFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div className="text-left">
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          {uploadProgress === 100 && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>

                        {isUploading && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedFile(null)
                            setUploadProgress(0)
                          }}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hapus File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">Drag & drop file di sini</p>
                          <p className="text-sm text-muted-foreground">atau klik untuk memilih file</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button type="button" variant="outline" asChild>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              Pilih File PDF
                            </label>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Hanya file PDF yang diperbolehkan (Max: 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Catatan */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Tambahkan catatan jika diperlukan..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedAssignment || !studentName || !uploadedFile || isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Kumpulkan Tugas
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}

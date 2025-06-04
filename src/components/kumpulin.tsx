"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { uploadassignment } from "@/actions/postassignment"
import { useToast } from "@/hooks/use-toast"

const AssignmentUploadForm = () => {
  const params = useParams()
  const geturlname = params?.nameAssignment as string
  const name = decodeURIComponent(geturlname)
  const { toast } = useToast()

  const [emailStudent, setEmailStudent] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const classes = ["IPA", "IPS"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const files = fileInputRef.current?.files
    if (!emailStudent || !selectedClass || !files || files.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields and select at least one file.",
        variant: "destructive",
      })
      return
    }

    setStatusMessage("Uploading assignments...")

    const formData = new FormData()
    for (const file of files) {
      formData.append("file", file)
    }
    formData.append("nameStudent", emailStudent.split("@")[0] || "")
    formData.append("email", emailStudent)
    formData.append("class", selectedClass)
    formData.append("folder", name)

    try {
      const result = await uploadassignment(formData)
      
      if (result.success) {
        setStatusMessage("Upload Successful!")
        toast({
          title: "Success",
          description: "Assignment uploaded successfully!",
        })

        // Reset form
        setEmailStudent("")
        setSelectedClass("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setStatusMessage("Upload Failed!")
        toast({
          title: "Upload Failed",
          description: result.error || "An error occurred during upload",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setStatusMessage("Upload Failed!")
      toast({
        title: "Upload Failed",
        description: `${error}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Upload {name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="emailStudent" className="block text-sm font-medium mb-1">
            Masukkan email
          </label>
          <input
            type="email"
            id="emailStudent"
            value={emailStudent}
            onChange={(e) => setEmailStudent(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter student's email"
            required
          />
        </div>

        <div>
          <label htmlFor="classSelect" className="block text-sm font-medium mb-1">
            Pilih Kelas
          </label>
          <select
            id="classSelect"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Kelas</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">
            Assignment Files
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            multiple
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Upload Assignments
        </button>

        {statusMessage && (
          <div className="flex items-center justify-center">
            <Badge
              className={`text-sm ${
                statusMessage.includes("Failed")
                  ? "bg-red-600 hover:bg-red-700"
                  : statusMessage.includes("Successful")
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {statusMessage}
            </Badge>
          </div>
        )}
      </form>
    </div>
  )
}

export default AssignmentUploadForm

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import AssignmentModal, { type AssignmentData } from "@/components/assignment-modal"

export default function AddAssignmentButton() {
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)

  const handleAddAssignment = () => {
    setIsAssignmentModalOpen(true)
  }

  const handleAssignmentSubmit = (assignmentData: AssignmentData) => {
    console.log("Assignment created:", assignmentData)
    
    // Here you would typically save the assignment to your backend
    // For now, we'll just log it and close the modal
    setIsAssignmentModalOpen(false)
  }

  return (
    <>
      <Button 
        onClick={handleAddAssignment}
        className="w-fit"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Tambah Tugas
      </Button>

      <AssignmentModal
        open={isAssignmentModalOpen}
        onOpenChange={setIsAssignmentModalOpen}
        onSubmit={handleAssignmentSubmit}
      />
    </>
  )
}

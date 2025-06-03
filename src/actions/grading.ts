"use server"

import { db } from "@/db"
import { documents } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface GradeSubmissionRequest {
  documentId: string
  grade: string
  correction: string
}

interface EmailFeedbackRequest {
  documentId: string
  studentEmail: string
  studentName: string
  assignmentTitle: string
  feedback: string
  grade?: string
}

interface GradeSubmissionResponse {
  success: boolean
  message?: string
  error?: string
}

export async function submitGrade(request: GradeSubmissionRequest): Promise<GradeSubmissionResponse> {
  try {
    const result = await db
      .update(documents)
      .set({
        grade: request.grade,
        feedback: request.correction
      })
      .where(eq(documents.id, request.documentId))
      .returning()

    if (result.length === 0) {
      return {
        success: false,
        error: "Document not found"
      }
    }

    // Revalidate the folder page to show updated data
    const document = result[0]
    if (document.folder) {
      revalidatePath(`/folders/${document.folder}`)
    }

    return {
      success: true,
      message: "Grade submitted successfully"    }
  } catch (error) {
    console.error("Error submitting grade:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function sendFeedbackEmail(request: EmailFeedbackRequest): Promise<GradeSubmissionResponse> {
  try {
    const emailContent = `
      <h2>Feedback untuk Tugas: ${request.assignmentTitle}</h2>
      <p>Halo ${request.studentName},</p>
      <p>Berikut adalah feedback untuk tugas yang telah Anda kumpulkan:</p>
      ${request.grade ? `<p><strong>Nilai:</strong> ${request.grade}</p>` : ''}
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <h3>Feedback:</h3>
        <p style="white-space: pre-wrap;">${request.feedback}</p>
      </div>
      <p>Terima kasih,<br>Tim Pengajar</p>
    `

    await resend.emails.send({
      from: 'noreply@yourdomain.com', // Change this to your verified domain
      to: request.studentEmail,
      subject: `Feedback Tugas: ${request.assignmentTitle}`,
      html: emailContent,
    })

    return {
      success: true,
      message: "Email sent successfully"
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email"
    }
  }
}

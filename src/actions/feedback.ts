"use server"

interface FeedbackRequest {
  title: string
  studentName: string
  fileName: string
}

interface FeedbackResponse {
  success: boolean
  feedback?: string
  error?: string
}

export async function generateAIFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
  try {
    const response = await fetch("http://localhost:8000/feedback/?token=ngumpulin-fastapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: request.title,
        description: `Assignment submission by ${request.studentName}`,
        content: `File: ${request.fileName}`,
        persona: "teacher"
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract combined_output from the API response
    const feedbackText = data.combined_output || data.feedback || data.content || data.message || "No feedback received"
    
    return {
      success: true,
      feedback: feedbackText
    }
  } catch (error) {
    console.error("Error generating AI feedback:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

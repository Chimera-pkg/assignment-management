"use server"

import { db } from "@/db"
import { documents, folders } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export interface DocumentData {
  id: string
  nrp: string | null
  email: string | null
  name_student: string
  class_name: string | null
  folder: string | null
  document_name: string
  document_url: string
  uploaded_date: Date
  feedback: string | null
  grade: string | null
  isi_tugas: string | null
}

export interface FolderData {
  id: number
  name_assignment: string
  due_date: Date
  class_name: string | null
  description: string | null
  attachment_url: string | null
  plagiarism_thresholds: string[] | null
  use_password: boolean | null
  password: string | null
  created_at: Date | null
  document_count?: number
}

export async function getDocumentsByFolder(folderName: string): Promise<DocumentData[]> {
  try {
    const result = await db
      .select()
      .from(documents)
      .where(eq(documents.folder, folderName))
      .orderBy(documents.uploaded_date)

    return result.map(doc => ({
      id: doc.id,
      nrp: doc.nrp,
      email: doc.email,
      name_student: doc.name_student,
      class_name: doc.class_name,
      folder: doc.folder,
      document_name: doc.document_name,
      document_url: doc.document_url,
      uploaded_date: doc.uploaded_date,
      feedback: doc.feedback,
      grade: doc.grade ? doc.grade.toString() : null,
      isi_tugas: doc.isi_tugas
    }))
  } catch (error) {
    console.error("Error fetching documents:", error)
    return []
  }
}

export async function getFolders(): Promise<FolderData[]> {
  try {
    const result = await db
      .select({
        id: folders.id,
        name_assignment: folders.name_assignment,
        due_date: folders.due_date,
        class_name: folders.class_name,
        description: folders.description,
        attachment_url: folders.attachment_url,
        plagiarism_thresholds: folders.plagiarism_thresholds,
        use_password: folders.use_password,
        password: folders.password,
        created_at: folders.created_at
      })
      .from(folders)
      .orderBy(folders.created_at)

    // Get document count for each folder
    const foldersWithCount = await Promise.all(
      result.map(async (folder) => {
        const docCount = await db
          .select()
          .from(documents)
          .where(eq(documents.folder, folder.name_assignment))

        return {
          ...folder,
          document_count: docCount.length
        }
      })
    )

    return foldersWithCount
  } catch (error) {
    console.error("Error fetching folders:", error)
    return []
  }
}

export async function getFolderByName(folderName: string): Promise<FolderData | null> {
  try {
    const result = await db
      .select()
      .from(folders)
      .where(eq(folders.name_assignment, folderName))
      .limit(1)

    if (result.length === 0) return null

    const folder = result[0]
    const docCount = await db
      .select()
      .from(documents)
      .where(eq(documents.folder, folder.name_assignment))

    return {
      id: folder.id,
      name_assignment: folder.name_assignment,
      due_date: folder.due_date,
      class_name: folder.class_name,
      description: folder.description,
      attachment_url: folder.attachment_url,
      plagiarism_thresholds: folder.plagiarism_thresholds,
      use_password: folder.use_password,
      password: folder.password,
      created_at: folder.created_at,
      document_count: docCount.length
    }
  } catch (error) {
    console.error("Error fetching folder:", error)
    return null
  }
}

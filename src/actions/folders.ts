"use server"

import { db } from "@/db"
import { folders, documents } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export interface CreateFolderRequest {
  name_assignment: string
  due_date: Date
  class_name?: string
  description?: string
  attachment_url?: string
  plagiarism_thresholds?: number[]
  use_password?: boolean
  password?: string
}

export interface UpdateFolderRequest {
  id: number
  name_assignment?: string
  due_date?: Date
  class_name?: string
  description?: string
  attachment_url?: string
  plagiarism_thresholds?: number[]
  use_password?: boolean
  password?: string
}

export interface FolderActionResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

export interface FolderWithCount {
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
  document_count: number
}

export async function createFolder(request: CreateFolderRequest): Promise<FolderActionResponse> {
  try {
    const result = await db
      .insert(folders)
      .values({
        name_assignment: request.name_assignment,
        due_date: request.due_date,
        class_name: request.class_name,
        description: request.description,
        attachment_url: request.attachment_url,
        plagiarism_thresholds: request.plagiarism_thresholds?.map(String),
        use_password: request.use_password || false,
        password: request.password
      })
      .returning()

    revalidatePath("/folders")
    
    return {
      success: true,
      message: "Folder created successfully",
      data: result[0]
    }
  } catch (error) {
    console.error("Error creating folder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function updateFolder(request: UpdateFolderRequest): Promise<FolderActionResponse> {
  try {
    const updateData: any = {}
    
    if (request.name_assignment !== undefined) updateData.name_assignment = request.name_assignment
    if (request.due_date !== undefined) updateData.due_date = request.due_date
    if (request.class_name !== undefined) updateData.class_name = request.class_name
    if (request.description !== undefined) updateData.description = request.description
    if (request.attachment_url !== undefined) updateData.attachment_url = request.attachment_url
    if (request.plagiarism_thresholds !== undefined) updateData.plagiarism_thresholds = request.plagiarism_thresholds?.map(String)
    if (request.use_password !== undefined) updateData.use_password = request.use_password
    if (request.password !== undefined) updateData.password = request.password

    const result = await db
      .update(folders)
      .set(updateData)
      .where(eq(folders.id, request.id))
      .returning()

    revalidatePath("/folders")
    
    return {
      success: true,
      message: "Folder updated successfully",
      data: result[0]
    }
  } catch (error) {
    console.error("Error updating folder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function deleteFolder(folderId: number): Promise<FolderActionResponse> {
  try {
    await db
      .delete(folders)
      .where(eq(folders.id, folderId))

    revalidatePath("/folders")
    
    return {
      success: true,
      message: "Folder deleted successfully"
    }
  } catch (error) {
    console.error("Error deleting folder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export async function getAllFolders(): Promise<FolderWithCount[]> {
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

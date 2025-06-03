import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, FileText, BookOpen } from "lucide-react"
import { getAllFolders, type FolderWithCount } from "@/actions/folders"
import FolderCard from "@/components/folder-card"
import AddAssignmentButton from "@/components/add-assignment-button"

// Color palette for folder badges
const folderColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-purple-100 text-purple-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-indigo-100 text-indigo-800",
  "bg-yellow-100 text-yellow-800",
  "bg-red-100 text-red-800",
]

export default async function ManageFolders() {
  const folders = await getAllFolders()

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Kelola Folder Tugas</h1>
        </div>
      </header>

      <div className="p-6">
        {/* Add Assignment Button */}
        <div className="mb-6">
          <AddAssignmentButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder, index) => {
            const colorClass = folderColors[index % folderColors.length]
            
            return (
              <FolderCard
                key={folder.id}
                folder={{
                  id: folder.id,
                  name: folder.name_assignment,
                  description: folder.description || "Tidak ada deskripsi",
                  assignmentCount: folder.document_count,
                  color: colorClass,
                  due_date: folder.due_date,
                  class_name: folder.class_name,
                }}
              />
            )
          })}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada folder</h3>
            <p className="text-muted-foreground mb-4">Buat folder pertama Anda untuk mengorganisir tugas-tugas</p>
          </div>
        )}
      </div>
    </SidebarInset>
  )
}

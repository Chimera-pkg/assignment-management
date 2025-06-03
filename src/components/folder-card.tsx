"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FolderOpen, Edit, Trash2, FileText } from "lucide-react"
import { updateFolder, deleteFolder } from "@/actions/folders"
import { useToast } from "@/hooks/use-toast"

interface FolderCardProps {
  folder: {
    id: number
    name: string
    description: string
    assignmentCount: number
    color: string
    due_date: Date
    class_name: string | null
  }
}

export default function FolderCard({ folder }: FolderCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: folder.name,
    description: folder.description,
  })

  const handleFolderClick = (folderName: string) => {
    // Convert folder name to URL-friendly format
    const urlFriendlyName = folderName.toLowerCase().replace(/\s+/g, '-')
    router.push(`/folders/${urlFriendlyName}`)
  }

  const handleEditFolder = () => {
    setEditForm({
      name: folder.name,
      description: folder.description,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateFolder = async () => {
    if (!editForm.name.trim()) {
      toast({
        title: "Error",
        description: "Nama folder tidak boleh kosong",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await updateFolder({
        id: folder.id,
        name_assignment: editForm.name,
        description: editForm.description,
      })

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Folder berhasil diperbarui",
        })
        setIsEditDialogOpen(false)
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal memperbarui folder",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui folder",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFolder = async () => {
    setIsLoading(true)
    try {
      const result = await deleteFolder(folder.id)

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Folder berhasil dihapus",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.error || "Gagal menghapus folder",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus folder",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleFolderClick(folder.name)}
          >
            <FolderOpen className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">{folder.name}</CardTitle>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleEditFolder}>
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-folder-name">Nama Folder</Label>
                    <Input
                      id="edit-folder-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-folder-description">Deskripsi</Label>
                    <Input
                      id="edit-folder-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleUpdateFolder} 
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isLoading}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Folder</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus folder "{folder.name}"? Tindakan ini tidak dapat
                    dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteFolder}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Menghapus..." : "Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{folder.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{folder.assignmentCount} tugas</span>
          </div>
          <Badge variant="secondary" className={folder.color}>
            {folder.name}
          </Badge>
        </div>
        {folder.class_name && (
          <div className="text-xs text-muted-foreground">
            Kelas: {folder.class_name}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

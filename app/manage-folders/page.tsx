"use client"

import { useState } from "react"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
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
import { FolderOpen, Plus, Edit, Trash2, FileText } from "lucide-react"

// Mock data for folders
const initialFolders = [
  {
    id: 1,
    name: "Matematika",
    description: "Folder untuk tugas-tugas matematika",
    assignmentCount: 5,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    name: "Bahasa Indonesia",
    description: "Folder untuk tugas bahasa dan sastra",
    assignmentCount: 3,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Sains",
    description: "Folder untuk tugas fisika, kimia, dan biologi",
    assignmentCount: 7,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    name: "Sejarah",
    description: "Folder untuk tugas sejarah dan sosial",
    assignmentCount: 2,
    color: "bg-orange-100 text-orange-800",
  },
]

export default function ManageFolders() {
  const [folders, setFolders] = useState(initialFolders)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<any>(null)
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
  })

  const handleCreateFolder = () => {
    if (!newFolder.name.trim()) return

    const folder = {
      id: Date.now(),
      name: newFolder.name,
      description: newFolder.description,
      assignmentCount: 0,
      color: "bg-gray-100 text-gray-800",
    }

    setFolders([...folders, folder])
    setNewFolder({ name: "", description: "" })
    setIsCreateDialogOpen(false)
  }

  const handleEditFolder = (folder: any) => {
    setEditingFolder(folder)
    setNewFolder({
      name: folder.name,
      description: folder.description,
    })
  }

  const handleUpdateFolder = () => {
    if (!newFolder.name.trim() || !editingFolder) return

    setFolders(
      folders.map((folder) =>
        folder.id === editingFolder.id
          ? { ...folder, name: newFolder.name, description: newFolder.description }
          : folder,
      ),
    )

    setEditingFolder(null)
    setNewFolder({ name: "", description: "" })
  }

  const handleDeleteFolder = (folderId: number) => {
    setFolders(folders.filter((folder) => folder.id !== folderId))
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Kelola Folder Tugas</h1>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Buat Folder Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Folder Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Nama Folder</Label>
                  <Input
                    id="folder-name"
                    placeholder="Masukkan nama folder..."
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="folder-description">Deskripsi</Label>
                  <Input
                    id="folder-description"
                    placeholder="Masukkan deskripsi folder..."
                    value={newFolder.description}
                    onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateFolder} className="flex-1">
                    Buat Folder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setNewFolder({ name: "", description: "" })
                    }}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <Card key={folder.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{folder.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Dialog
                      open={editingFolder?.id === folder.id}
                      onOpenChange={(open) => !open && setEditingFolder(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEditFolder(folder)}>
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
                              value={newFolder.name}
                              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-folder-description">Deskripsi</Label>
                            <Input
                              id="edit-folder-description"
                              value={newFolder.description}
                              onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleUpdateFolder} className="flex-1">
                              Simpan Perubahan
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingFolder(null)
                                setNewFolder({ name: "", description: "" })
                              }}
                            >
                              Batal
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
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
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{folder.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{folder.assignmentCount} tugas</span>
                  </div>
                  <Badge variant="secondary" className={folder.color}>
                    {folder.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada folder</h3>
            <p className="text-muted-foreground mb-4">Buat folder pertama Anda untuk mengorganisir tugas-tugas</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Folder Baru
            </Button>
          </div>
        )}
      </div>
    </SidebarInset>
  )
}

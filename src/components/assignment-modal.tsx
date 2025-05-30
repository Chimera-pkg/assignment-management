"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Save, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface AssignmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (assignmentData: AssignmentData) => void
  folderId?: number
}

export interface AssignmentData {
  title: string
  description: string
  category: string
  points: string
  deadline?: Date
  isActive: boolean
  folderId?: number
}

export default function AssignmentModal({ open, onOpenChange, onSubmit, folderId }: AssignmentModalProps) {
  const [date, setDate] = useState<Date>()
  const [isActive, setIsActive] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    points: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const assignmentData: AssignmentData = {
      ...formData,
      deadline: date,
      isActive,
      folderId,
    }

    if (onSubmit) {
      onSubmit(assignmentData)
    }

    // Reset form
    handleReset()
    onOpenChange(false)
  }

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      points: "",
    })
    setDate(undefined)
    setIsActive(true)
  }

  const handleCancel = () => {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Tugas Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Judul Tugas */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas</Label>
            <Input
              id="title"
              placeholder="Masukkan judul tugas..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Masukkan deskripsi tugas..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: id }) : "Pilih tanggal deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Kategori/Mata Pelajaran */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori/Mata Pelajaran</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matematika">Matematika</SelectItem>
                <SelectItem value="bahasa-indonesia">Bahasa Indonesia</SelectItem>
                <SelectItem value="bahasa-inggris">Bahasa Inggris</SelectItem>
                <SelectItem value="fisika">Fisika</SelectItem>
                <SelectItem value="kimia">Kimia</SelectItem>
                <SelectItem value="biologi">Biologi</SelectItem>
                <SelectItem value="sejarah">Sejarah</SelectItem>
                <SelectItem value="geografi">Geografi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bobot/Point */}
          <div className="space-y-2">
            <Label htmlFor="points">Bobot/Point</Label>
            <Input
              id="points"
              type="number"
              placeholder="Masukkan bobot nilai..."
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              min="0"
              max="100"
              required
            />
          </div>

          {/* Status Aktif */}
          <div className="flex items-center space-x-2">
            <Switch id="active-status" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="active-status">Status Aktif</Label>
            <span className="text-sm text-muted-foreground">
              ({isActive ? "Tugas dapat dikumpulkan" : "Tugas tidak dapat dikumpulkan"})
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Simpan Tugas
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

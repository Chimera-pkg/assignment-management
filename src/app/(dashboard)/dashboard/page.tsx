"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Award,
  FileText,
  BarChart3
} from "lucide-react";

const mockData = {
  overview: {
    totalTugas: 45,
    totalSiswa: 28,
    pengumpulanTertunda: 12,
    rataRataNilai: 85.3
  },
  weeklyActivity: [
    { day: "Sen", pengumpulan: 8, penilaian: 6 },
    { day: "Sel", pengumpulan: 12, penilaian: 10 },
    { day: "Rab", pengumpulan: 15, penilaian: 12 },
    { day: "Kam", pengumpulan: 10, penilaian: 14 },
    { day: "Jum", pengumpulan: 18, penilaian: 16 },
    { day: "Sab", pengumpulan: 5, penilaian: 8 },
    { day: "Min", pengumpulan: 3, penilaian: 4 }
  ],
  recentAssignments: [
    {
      id: 1,
      title: "Analisis Algoritma Sorting",
      subject: "Algoritma & Struktur Data",
      dueDate: "2025-05-30",
      submitted: 22,
      total: 28,
      status: "active"
    },
    {
      id: 2,
      title: "Project Web Development",
      subject: "Pemrograman Web",
      dueDate: "2025-06-02",
      submitted: 15,
      total: 28,
      status: "active"
    },
    {
      id: 3,
      title: "Database Design",
      subject: "Basis Data",
      dueDate: "2025-05-28",
      submitted: 28,
      total: 28,
      status: "completed"
    },
    {
      id: 4,
      title: "UI/UX Prototype",
      subject: "Desain Interface",
      dueDate: "2025-06-05",
      submitted: 8,
      total: 28,
      status: "active"
    },
    {
      id: 5,
      title: "Network Security Analysis",
      subject: "Keamanan Jaringan",
      dueDate: "2025-05-25",
      submitted: 20,
      total: 28,
      status: "overdue"
    }
  ],
  topStudents: [
    { name: "Ahmad Rizki", grade: "A", score: 95.5, assignments: 12 },
    { name: "Siti Nurhaliza", grade: "A", score: 93.2, assignments: 11 },
    { name: "Budi Santoso", grade: "A-", score: 91.8, assignments: 12 },
    { name: "Maya Sari", grade: "A-", score: 90.5, assignments: 10 },
    { name: "Doni Prakoso", grade: "B+", score: 88.7, assignments: 11 },
    { name: "Fitri Handayani", grade: "B+", score: 87.9, assignments: 9 },
    { name: "Reza Firmansyah", grade: "B+", score: 86.4, assignments: 10 }
  ],
  subjects: [
    {
      name: "Algoritma & Struktur Data",
      assignments: 8,
      avgGrade: 88.5,
      completion: 92,
      students: 28
    },
    {
      name: "Pemrograman Web",
      assignments: 6,
      avgGrade: 85.2,
      completion: 87,
      students: 28
    },
    {
      name: "Basis Data",
      assignments: 7,
      avgGrade: 90.1,
      completion: 95,
      students: 28
    },
    {
      name: "Desain Interface",
      assignments: 5,
      avgGrade: 82.7,
      completion: 78,
      students: 28
    },
    {
      name: "Keamanan Jaringan",
      assignments: 4,
      avgGrade: 86.8,
      completion: 85,
      students: 28
    }
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
    case "active":
      return <Badge className="bg-blue-100 text-blue-800">Aktif</Badge>;
    case "overdue":
      return <Badge className="bg-red-100 text-red-800">Terlambat</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getGradeBadge = (grade: string) => {
  const gradeColors = {
    "A": "bg-green-500",
    "A-": "bg-green-400",
    "B+": "bg-blue-500",
    "B": "bg-blue-400",
    "B-": "bg-yellow-500",
    "C+": "bg-orange-500",
    "C": "bg-red-400"
  };
  
  return (
    <Badge className={`${gradeColors[grade as keyof typeof gradeColors] || "bg-gray-400"} text-white`}>
      {grade}
    </Badge>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau tugas serta performa siswa Anda
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalTugas}</div>
            <p className="text-xs text-muted-foreground">
              +3 dari bulan lalu
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.overview.totalSiswa}</div>
            <p className="text-xs text-muted-foreground">
              Siswa aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengumpulan Tertunda</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockData.overview.pengumpulanTertunda}</div>
            <p className="text-xs text-muted-foreground">
              Memerlukan tindak lanjut
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockData.overview.rataRataNilai}</div>
            <p className="text-xs text-muted-foreground">
              +2.1% dari minggu lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="assignments">Tugas</TabsTrigger>
          <TabsTrigger value="students">Siswa</TabsTrigger>
          <TabsTrigger value="subjects">Mapel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Aktivitas Mingguan
                </CardTitle>
                <CardDescription>Pengumpulan dan penilaian tugas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.weeklyActivity.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium">{day.day}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Pengumpulan: {day.pengumpulan}</span>
                          <span>Penilaian: {day.penilaian}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Progress value={(day.pengumpulan / 20) * 100} className="h-2" />
                          <Progress value={(day.penilaian / 20) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Cepat</CardTitle>
                <CardDescription>Ringkasan performa terkini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tugas Selesai</span>
                    <span className="font-medium">38/45 (84%)</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tingkat Pengumpulan</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Siswa Aktif</span>
                    <span className="font-medium">26/28 (93%)</span>
                  </div>
                  <Progress value={93} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Penilaian Selesai</span>
                    <span className="font-medium">32/38 (84%)</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Tugas Terbaru
              </CardTitle>
              <CardDescription>Daftar tugas yang sedang berlangsung</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.recentAssignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-medium truncate">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{assignment.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right space-y-2 flex-shrink-0 ml-4">
                      {getStatusBadge(assignment.status)}
                      <div className="text-sm">
                        <span className="font-medium">{assignment.submitted}</span>
                        <span className="text-muted-foreground">/{assignment.total}</span>
                      </div>
                      <Progress 
                        value={(assignment.submitted / assignment.total) * 100} 
                        className="w-20 h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Siswa Terbaik
              </CardTitle>
              <CardDescription>Ranking berdasarkan performa tugas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.topStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                        <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.assignments} tugas diselesaikan
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1 flex-shrink-0">
                      {getGradeBadge(student.grade)}
                      <div className="text-sm font-medium">{student.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {mockData.subjects.map((subject, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base leading-tight">{subject.name}</CardTitle>
                  <CardDescription>{subject.students} siswa terdaftar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-blue-600">{subject.assignments}</div>
                      <div className="text-xs text-muted-foreground">Total Tugas</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-green-600">{subject.avgGrade}</div>
                      <div className="text-xs text-muted-foreground">Rata-rata Nilai</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tingkat Penyelesaian</span>
                      <span className="font-medium">{subject.completion}%</span>
                    </div>
                    <Progress value={subject.completion} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Aktif
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
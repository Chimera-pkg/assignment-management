import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Calendar, BarChart3 } from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">AssignmentHub</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-black">Login</Button>
                        </Link>
                        <Link href="/folders">
                            <Button>Daftar</Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        AI Assignment Management System
                        <span className="block text-blue-600">yang Efisien</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Kelola semua tugas, assignment, dan proyek dalam satu platform terpadu. 
                        Tingkatkan produktivitas dan organisasi dengan fitur lengkap untuk pendidik dan siswa.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="px-8 py-3">
                                Mulai gratis
                            </Button>
                        </Link>
                        <Link href="/folders">
                            <Button variant="outline" size="lg" className="px-8 py-3">
                                Lihat cara kerja
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>Kelola Tugas</CardTitle>
                            <CardDescription>
                                Organisir tugas berdasarkan folder dan kategori untuk kemudahan akses
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Monitor Siswa</CardTitle>
                            <CardDescription>
                                Pantau progress dan performa siswa dengan sistem tracking terintegrasi
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle>Analisis Data</CardTitle>
                            <CardDescription>
                                Dapatkan insight mendalam dengan dashboard analytics yang komprehensif
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span className="font-semibold text-gray-900">AssignmentHub</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2025 Assignment Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
'use server';

import { db } from "@/db";
import { folders } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface Assignment {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isActive: boolean;
  maxFileSize: number; // in bytes
  allowedFileTypes: string[];
  className?: string;
}

export async function getAssignmentByName(assignmentName: string): Promise<Assignment | null> {
  try {
    // Query database untuk assignment berdasarkan nama
    const result = await db
      .select()
      .from(folders)
      .where(eq(folders.name_assignment, assignmentName))
      .limit(1);

    if (result.length === 0) {
      // Jika tidak ditemukan di database, gunakan mock data untuk development
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          name: 'Tugas-Matematika-Kelas-8',
          description: 'Tugas matematika untuk kelas 8 tentang aljabar',
          dueDate: '2025-06-15T23:59:59Z',
          isActive: true,
          maxFileSize: 10 * 1024 * 1024, // 10MB
          allowedFileTypes: ['application/pdf'],
          className: 'Kelas 8'
        },
        {
          id: '2',
          name: 'Essay-Bahasa-Indonesia',
          description: 'Essay tentang lingkungan hidup',
          dueDate: '2025-06-20T23:59:59Z',
          isActive: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedFileTypes: ['application/pdf'],
          className: 'Kelas 9'
        },
        {
          id: '3',
          name: 'Laporan-IPA-Semester-2',
          description: 'Laporan praktikum IPA semester 2',
          dueDate: '2025-06-25T23:59:59Z',
          isActive: true,
          maxFileSize: 15 * 1024 * 1024, // 15MB
          allowedFileTypes: ['application/pdf'],
          className: 'Kelas 7'
        }
      ];

      const assignment = mockAssignments.find(
        a => a.name === assignmentName || a.name === decodeURIComponent(assignmentName)
      );

      return assignment || null;
    }

    const folder = result[0];
    
    // Convert database result to Assignment format
    const assignment: Assignment = {
      id: folder.id.toString(),
      name: folder.name_assignment,
      description: folder.description || 'Tidak ada deskripsi',
      dueDate: folder.due_date.toISOString(),
      isActive: new Date() < folder.due_date, // Check if still active
      maxFileSize: 10 * 1024 * 1024, // Default 10MB
      allowedFileTypes: ['application/pdf'],
      className: folder.class_name || undefined
    };

    return assignment;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return null;
  }
}

export async function checkAssignmentDeadline(assignmentName: string): Promise<{
  isExpired: boolean;
  timeRemaining?: string;
  dueDate?: string;
}> {
  try {
    const assignment = await getAssignmentByName(assignmentName);
    
    if (!assignment) {
      return { isExpired: true };
    }

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isExpired = now > dueDate;

    if (isExpired) {
      return { isExpired: true, dueDate: assignment.dueDate };
    }

    // Calculate time remaining
    const timeDiff = dueDate.getTime() - now.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeRemaining = '';
    if (days > 0) {
      timeRemaining = `${days} hari ${hours} jam`;
    } else if (hours > 0) {
      timeRemaining = `${hours} jam ${minutes} menit`;
    } else {
      timeRemaining = `${minutes} menit`;
    }

    return {
      isExpired: false,
      timeRemaining,
      dueDate: assignment.dueDate
    };
  } catch (error) {
    console.error('Error checking deadline:', error);
    return { isExpired: true };
  }
}

export async function getAllAssignments(): Promise<Assignment[]> {
  try {
    const results = await db.select().from(folders);
    
    return results.map(folder => ({
      id: folder.id.toString(),
      name: folder.name_assignment,
      description: folder.description || 'Tidak ada deskripsi',
      dueDate: folder.due_date.toISOString(),
      isActive: new Date() < folder.due_date,
      maxFileSize: 10 * 1024 * 1024, // Default 10MB
      allowedFileTypes: ['application/pdf'],
      className: folder.class_name || undefined
    }));
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    return [];
  }
}

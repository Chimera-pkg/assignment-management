import { db } from './index';
import { documents, folders, classes } from './schema';
import { eq } from 'drizzle-orm';

// Seed data for classes
const classesData = [
  {
    class_name: "Informatika A",
    total_student: 30,
  },
  {
    class_name: "Informatika B", 
    total_student: 28,
  },
  {
    class_name: "Sistem Informasi A",
    total_student: 32,
  },
  {
    class_name: "Teknik Komputer A",
    total_student: 25,
  },
];

// Seed data for folders (assignments)
const foldersData = [
  {
    name_assignment: "Praktikum DNS Server",
    due_date: new Date('2024-02-15T23:59:59'),
    class_name: "Informatika A",
    description: "Implementasi DNS Server menggunakan BIND9 pada sistem Linux",
    attachment_url: "https://alwocqtpmrlfebnjjtct.supabase.co/storage/v1/object/public/Kumpulin/Pemrograman%20Web%20Dasar/2%20SDT%20B/3323600034_Dimas%20Firmansyah_Praktikum%20Pemrograman%20Web%20Dasar.pdf",
    plagiarism_thresholds: ["0.8", "0.9"],
    use_password: false,
    password: null,
  },
  {
    name_assignment: "Aljabar Linear",
    due_date: new Date('2024-02-20T23:59:59'),
    class_name: "Informatika A",
    description: "Soal-soal aljabar linear dan transformasi matriks",
    attachment_url: "https://alwocqtpmrlfebnjjtct.supabase.co/storage/v1/object/public/Kumpulin/Pemrograman%20Web%20Dasar/2%20SDT%20B/3323600033_Wahyu%20Rohman%20Dwiputra_Pemrograman%20Web%20Dasar%201.pdf", 
    plagiarism_thresholds: ["0.75", "0.85"],
    use_password: true,
    password: "algebra123",
  },
  {
    name_assignment: "Analisis Puisi",
    due_date: new Date('2024-02-25T23:59:59'),
    class_name: "Informatika B",
    description: "Analisis struktur dan makna puisi Indonesia modern",
    attachment_url: "https://example.com/assignment3.pdf",
    plagiarism_thresholds: ["0.7", "0.8"],
    use_password: false,
    password: null,
  },
  {
    name_assignment: "Eksperimen Gerak",
    due_date: new Date('2024-03-01T23:59:59'),
    class_name: "Sistem Informasi A",
    description: "Laporan praktikum fisika tentang gerak lurus beraturan",
    attachment_url: "https://example.com/assignment4.pdf",
    plagiarism_thresholds: ["0.8", "0.9"],
    use_password: false,
    password: null,
  },
  {
    name_assignment: "Reaksi Kimia",
    due_date: new Date('2024-03-05T23:59:59'),
    class_name: "Teknik Komputer A", 
    description: "Studi kasus reaksi kimia dalam proses industri",
    attachment_url: "https://example.com/assignment5.pdf",
    plagiarism_thresholds: ["0.75", "0.85"],
    use_password: true,
    password: "kimia456",
  },
];

// Seed data for documents (student submissions)
const documentsData = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    nrp: "5026211001",
    email: "john.doe@student.its.ac.id",
    name_student: "John Doe",
    class_name: "Informatika A",
    folder: "Praktikum DNS Server",
    document_name: "Laprak_BasicCMDofLinux_46.pdf",
    document_url: "https://alwocqtpmrlfebnjjtct.supabase.co/storage/v1/object/public/Kumpulin/Praktikum%20DNS%20Server/2%20SDT%20%20B/Laprak(2)_BasicCMDofLinux_46.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.15,
      detected_sources: [],
      is_plagiarized: false,
    },
    feedback: "Laporan sudah baik, namun perlu penambahan analisis hasil",
    page: 12,
    sentences: 145,
    isi_tugas: "Laporan praktikum implementasi DNS server dengan konfigurasi BIND9...",
    clustering: 1,
    grade: "85.5",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", 
    nrp: "5026211002",
    email: "jane.smith@student.its.ac.id",
    name_student: "Jane Smith",
    class_name: "Informatika A",
    folder: "Aljabar Linear",
    document_name: "Tugas_AljabarLinear_Jane.pdf",
    document_url: "https://www.africau.edu/images/default/sample.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.25,
      detected_sources: ["source1.pdf", "website.com"],
      is_plagiarized: false,
    },
    feedback: "Perhitungan matriks sudah benar, namun perlu penjelasan lebih detail",
    page: 8,
    sentences: 98,
    isi_tugas: "Penyelesaian sistem persamaan linear menggunakan metode eliminasi Gauss...",
    clustering: 2,
    grade: "78.0",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    nrp: "5026211003", 
    email: "bob.wilson@student.its.ac.id",
    name_student: "Bob Wilson",
    class_name: "Sistem Informasi A",
    folder: "Eksperimen Gerak",
    document_name: "Laporan_Fisika_Bob.pdf",
    document_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.18,
      detected_sources: [],
      is_plagiarized: false,
    },
    feedback: null,
    page: 10,
    sentences: 120,
    isi_tugas: "Analisis gerak lurus beraturan dengan menggunakan ticker timer...",
    clustering: 1,
    grade: null,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    nrp: "5026211004",
    email: "alice.brown@student.its.ac.id", 
    name_student: "Alice Brown",
    class_name: "Teknik Komputer A",
    folder: "Reaksi Kimia",
    document_name: "Tugas_Kimia_Alice.pdf",
    document_url: "https://www.africau.edu/images/default/sample.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.12,
      detected_sources: [],
      is_plagiarized: false,
    },
    feedback: "Analisis reaksi kimia sangat mendalam dan terstruktur dengan baik",
    page: 15,
    sentences: 180,
    isi_tugas: "Studi kasus reaksi redoks dalam industri metalurgi...",
    clustering: 3,
    grade: "92.0",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    nrp: "5026211005",
    email: "charlie.davis@student.its.ac.id",
    name_student: "Charlie Davis", 
    class_name: "Informatika B",
    folder: "Analisis Puisi",
    document_name: "Essay_Puisi_Charlie.pdf",
    document_url: "https://www.africau.edu/images/default/sample.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.22,
      detected_sources: ["literatur1.pdf"],
      is_plagiarized: false,
    },
    feedback: "Analisis makna puisi cukup baik, namun perlu lebih banyak referensi",
    page: 6,
    sentences: 85,
    isi_tugas: "Analisis struktur dan makna puisi 'Aku' karya Chairil Anwar...",
    clustering: 2,
    grade: "80.5",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    nrp: "5026211006",
    email: "diana.miller@student.its.ac.id",
    name_student: "Diana Miller",
    class_name: "Informatika A",
    folder: "Praktikum DNS Server", 
    document_name: "DNS_Server_Diana.pdf",
    document_url: "https://alwocqtpmrlfebnjjtct.supabase.co/storage/v1/object/public/Kumpulin/Praktikum%20DNS%20Server/2%20SDT%20%20B/Laprak(2)_BasicCMDofLinux_46.pdf",
    embedding: null,
    plagiarism: {
      similarity_score: 0.35,
      detected_sources: ["tutorial1.pdf", "documentation.com"],
      is_plagiarized: false,
    },
    feedback: null,
    page: 14,
    sentences: 165,
    isi_tugas: "Konfigurasi DNS server untuk domain universitas dengan multiple zones...",
    clustering: 1,
    grade: null,
  },
];

export async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(documents);
    await db.delete(folders);
    await db.delete(classes);

    // Insert classes
    console.log('📚 Inserting classes...');
    const insertedClasses = await db.insert(classes).values(classesData).returning();
    console.log(`✅ Inserted ${insertedClasses.length} classes`);

    // Insert folders
    console.log('📁 Inserting assignment folders...');
    const insertedFolders = await db.insert(folders).values(foldersData).returning();
    console.log(`✅ Inserted ${insertedFolders.length} assignment folders`);

    // Insert documents
    console.log('📄 Inserting student documents...');
    const insertedDocuments = await db.insert(documents).values(documentsData).returning();
    console.log(`✅ Inserted ${insertedDocuments.length} student documents`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Classes: ${insertedClasses.length}`);
    console.log(`- Assignment Folders: ${insertedFolders.length}`);
    console.log(`- Student Documents: ${insertedDocuments.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

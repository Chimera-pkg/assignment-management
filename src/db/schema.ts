import { pgTable, serial, text, timestamp, numeric, boolean, jsonb, integer, uuid, real, vector } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Table "documents"
export const documents = pgTable('documents', {
  // Tipe 1 (Identitas)
  id: uuid('id').primaryKey(),
  nrp: text('nrp'),
  email: text('email'),
  name_student: text('name_student').notNull(),
  class_name: text('class_name'),
  // Tipe 1 (Dokumen)
  folder: text('folder'),
  document_name: text('document_name').notNull(),
  document_url: text('document_url').notNull(),
  uploaded_date: timestamp('uploaded_date').defaultNow().notNull(),
  // Tipe 2 (Dokumen)
  embedding: vector('embedding', { dimensions: 1024 }),
  plagiarism: jsonb('plagiarism'),
  feedback: text('feedback'),
  page: integer('page'),
  sentences: integer('sentences'),
  isi_tugas: text('isi_tugas'),
  clustering: integer('clustering'),
  grade: numeric('grade'),
});

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name_assignment: text('name_assignment').notNull(),
  due_date: timestamp('due_date', { precision: 3 }).notNull(),
  class_name: text('class_name'),
  description: text('description'),
  attachment_url: text('attachment_url'),
  plagiarism_thresholds: numeric('plagiarism_thresholds').array(),
  use_password: boolean('use_password').default(false),
  password: text('password'),
  created_at: timestamp('created_at', { precision: 3 }).defaultNow(),
});

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  class_name: text('class_name').notNull(),
  total_student: numeric('total_student').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  folder: one(folders, {
    fields: [documents.folder],
    references: [folders.name_assignment]
  })
}));

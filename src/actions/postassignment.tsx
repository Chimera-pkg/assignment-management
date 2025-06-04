"use server"

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { documents, folders } from "@/db/schema";

const supabaseUrl = "https://svyzjrnlvtwrmijpgbiz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2eXpqcm5sdnR3cm1panBnYml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NzQ5MDAsImV4cCI6MjA2NDE1MDkwMH0._IvbC3ZFGYyW2ubpZ4Ar9gMyv17XLLITbGaZiblfn1o";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadassignment(formData: FormData): Promise<any> {
  try {
    // Mengambil file dan input
    const files = formData.getAll("file") as File[];
    const nameStudent = formData.get("nameStudent") as string;
    const email = formData.get("email") as string;
    const className = formData.get("class") as string;
    const folder = formData.get("folder") as string | null;

    if (!files.length || !nameStudent || !email || !className) {
      return {
        success: false,
        error: "Incomplete form data"
      };
    }

    const results = [];

    for (const file of files) {
      const uuid = crypto.randomUUID();
      
      try {
        // 1. Upload file ke Supabase Storage
        const filePath = `${folder}/${className}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('kumpulin')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // 2. Get public URL - Fixed bucket name consistency
        const { data: publicUrlData } = supabase.storage
          .from('kumpulin')
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          throw new Error(`Failed to get public URL for ${file.name}`);
        }

        const publicUrl = publicUrlData.publicUrl;

        // 3. Simpan metadata ke database terlebih dahulu
        const insertedDocument = await db.insert(documents).values({
          id: uuid,
          name_student: nameStudent,
          document_name: file.name,
          document_url: publicUrl,
          email: email,
          folder: folder || null,
          embedding: null,
        });

        // 4. Kirim ke FastAPI untuk processing
        const fastApiFormData = new FormData();
        fastApiFormData.append("uuid", uuid);
        fastApiFormData.append("file_url", publicUrl);

        console.log(`Sending to FastAPI - UUID: ${uuid}, URL: ${publicUrl}`);

        const fastApiResponse = await fetch("http://localhost:8000/assignment/upload?token=ngumpulin-fastapi", {
          method: "POST",
          body: fastApiFormData,
          headers: {
            'Accept': 'application/json',
          }
        });

        console.log(`FastAPI Response Status: ${fastApiResponse.status}`);

        if (!fastApiResponse.ok) {
          let errorData;
          try {
            const responseText = await fastApiResponse.text();
            console.log(`FastAPI Error Response: ${responseText}`);
            try {
              errorData = JSON.parse(responseText);
            } catch {
              errorData = { error: responseText };
            }
          } catch {
            errorData = { error: `HTTP ${fastApiResponse.status}: ${fastApiResponse.statusText}` };
          }
          
          console.error(`FastAPI processing failed for ${file.name}:`, {
            status: fastApiResponse.status,
            statusText: fastApiResponse.statusText,
            error: errorData
          });
        } else {
          const processingResult = await fastApiResponse.json();
          console.log(`FastAPI processing completed for ${file.name}:`, processingResult);
        }

        results.push({
          success: true,
          fileName: file.name,
          uuid: uuid,
          url: publicUrl
        });

      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        results.push({
          success: false,
          fileName: file.name,
          error: fileError instanceof Error ? fileError.message : 'Unknown error'
        });
      }
    }

    revalidatePath("/assignment");
    
    return {
      success: true,
      results: results,
      message: `Processed ${files.length} files`
    };

  } catch (error) {
    console.error("Upload assignment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
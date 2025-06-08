
import { supabase } from "@/integrations/supabase/client";
import { EncryptionService } from "./EncryptionService";
import { Json } from "@/integrations/supabase/types";

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  validation?: string; // Validation pattern
}

export interface GhostForm {
  id: string;
  title: string;
  description?: string;
  form_fields: FormField[];
  created_by: string;
  ghost_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_encrypted: boolean;
}

export class FormService {
  private static encryptionKey = 'form-encryption-key'; // In production, this should be securely managed

  /**
   * Create a new ghost form
   */
  static async createForm(form: {
    title: string;
    description?: string;
    form_fields: FormField[];
    ghost_id?: string;
    is_encrypted?: boolean;
  }): Promise<GhostForm | null> {
    try {
      // Convert FormField[] to Json type that Supabase expects
      let formFieldsJson: Json;
      
      // Encrypt form fields if requested
      if (form.is_encrypted) {
        const encryptedFields = EncryptionService.encrypt(
          JSON.stringify(form.form_fields),
          this.encryptionKey
        );
        formFieldsJson = encryptedFields as Json;
      } else {
        formFieldsJson = JSON.stringify(form.form_fields) as unknown as Json;
      }
      
      const formData = { 
        ...form,
        form_fields: formFieldsJson
      };
      
      const { data, error } = await supabase
        .from('ghost_forms')
        .insert(formData)
        .select('*')
        .single();

      if (error) throw error;
      
      // Convert the data back to our GhostForm type with FormField[]
      let parsedFields: FormField[];
      
      // Parse the form fields based on whether they're encrypted
      if (data.is_encrypted) {
        try {
          const decryptedFields = EncryptionService.decrypt(
            data.form_fields as string,
            this.encryptionKey
          );
          parsedFields = JSON.parse(decryptedFields);
        } catch (e) {
          console.error('Failed to decrypt form:', e);
          parsedFields = [];
        }
      } else {
        parsedFields = typeof data.form_fields === 'string' 
          ? JSON.parse(data.form_fields) 
          : (data.form_fields as unknown as FormField[]);
      }
      
      return {
        ...data,
        form_fields: parsedFields
      };
    } catch (error) {
      console.error('Error creating form:', error);
      return null;
    }
  }

  /**
   * Get all forms for the current user
   */
  static async getForms(): Promise<GhostForm[]> {
    try {
      const { data, error } = await supabase
        .from('ghost_forms')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Decrypt encrypted forms and convert to our FormField[] type
      return (data || []).map(form => {
        let parsedFields: FormField[];
        
        if (form.is_encrypted) {
          try {
            const decryptedFields = EncryptionService.decrypt(
              form.form_fields as string,
              this.encryptionKey
            );
            parsedFields = JSON.parse(decryptedFields);
          } catch (e) {
            console.error('Failed to decrypt form:', e);
            parsedFields = [];
          }
        } else {
          parsedFields = typeof form.form_fields === 'string' 
            ? JSON.parse(form.form_fields as string) 
            : (form.form_fields as unknown as FormField[]);
        }
        
        return { 
          ...form, 
          form_fields: parsedFields 
        };
      });
    } catch (error) {
      console.error('Error fetching forms:', error);
      return [];
    }
  }

  /**
   * Get a specific form by ID
   */
  static async getForm(id: string): Promise<GhostForm | null> {
    try {
      const { data, error } = await supabase
        .from('ghost_forms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      let parsedFields: FormField[];
      
      // Decrypt if encrypted
      if (data.is_encrypted) {
        try {
          const decryptedFields = EncryptionService.decrypt(
            data.form_fields as string,
            this.encryptionKey
          );
          parsedFields = JSON.parse(decryptedFields);
        } catch (e) {
          console.error('Failed to decrypt form:', e);
          parsedFields = [];
        }
      } else {
        parsedFields = typeof data.form_fields === 'string' 
          ? JSON.parse(data.form_fields as string) 
          : (data.form_fields as unknown as FormField[]);
      }
      
      return {
        ...data,
        form_fields: parsedFields
      };
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  }

  /**
   * Update a form
   */
  static async updateForm(id: string, updates: {
    title?: string;
    description?: string;
    form_fields?: FormField[];
    ghost_id?: string;
    is_encrypted?: boolean;
  }): Promise<GhostForm | null> {
    try {
      let updateData: Record<string, any> = { ...updates };
      
      // Get current form to check encryption status
      const { data: currentForm } = await supabase
        .from('ghost_forms')
        .select('is_encrypted')
        .eq('id', id)
        .single();
      
      // Encrypt form fields if needed and convert to Json type
      if (updates.form_fields) {
        if (updates.is_encrypted || currentForm?.is_encrypted) {
          updateData.form_fields = EncryptionService.encrypt(
            JSON.stringify(updates.form_fields),
            this.encryptionKey
          ) as unknown as Json;
        } else {
          updateData.form_fields = JSON.stringify(updates.form_fields) as unknown as Json;
        }
      }
      
      const { data, error } = await supabase
        .from('ghost_forms')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      
      // Convert back to our GhostForm type
      let parsedFields: FormField[];
      
      // Parse fields based on encryption status
      if (data.is_encrypted) {
        try {
          const decryptedFields = EncryptionService.decrypt(
            data.form_fields as string,
            this.encryptionKey
          );
          parsedFields = JSON.parse(decryptedFields);
        } catch (e) {
          console.error('Failed to decrypt form:', e);
          parsedFields = [];
        }
      } else {
        parsedFields = typeof data.form_fields === 'string' 
          ? JSON.parse(data.form_fields as string) 
          : (data.form_fields as unknown as FormField[]);
      }
      
      return {
        ...data,
        form_fields: parsedFields
      };
    } catch (error) {
      console.error('Error updating form:', error);
      return null;
    }
  }

  /**
   * Soft delete a form (sets deleted_at timestamp)
   */
  static async deleteForm(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ghost_forms')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      return false;
    }
  }

  /**
   * Permanently delete a form
   */
  static async permanentlyDeleteForm(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ghost_forms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error permanently deleting form:', error);
      return false;
    }
  }
}

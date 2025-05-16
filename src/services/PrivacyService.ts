
import { supabase } from "@/integrations/supabase/client";

export interface PrivacySettings {
  id: string;
  user_id: string;
  auto_delete_after?: string | null;
  visibility_scope: 'private' | 'limited' | 'public';
  encryption_level: 'standard' | 'high' | 'maximum';
  created_at: string;
  updated_at: string;
}

export class PrivacyService {
  /**
   * Get privacy settings for the current user
   */
  static async getPrivacySettings(): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      
      // Convert the data to match our PrivacySettings interface
      if (!data) return null;
      
      return {
        ...data,
        auto_delete_after: data.auto_delete_after as string,
        visibility_scope: (data.visibility_scope || 'private') as 'private' | 'limited' | 'public',
        encryption_level: (data.encryption_level || 'standard') as 'standard' | 'high' | 'maximum'
      };
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      return null;
    }
  }

  /**
   * Update privacy settings for the current user
   */
  static async updatePrivacySettings(settings: {
    auto_delete_after?: string | null;
    visibility_scope?: 'private' | 'limited' | 'public';
    encryption_level?: 'standard' | 'high' | 'maximum';
  }): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .update(settings)
        .select('*')
        .single();

      if (error) throw error;
      
      // Convert the data to match our PrivacySettings interface
      return {
        ...data,
        auto_delete_after: data.auto_delete_after as string,
        visibility_scope: (data.visibility_scope || 'private') as 'private' | 'limited' | 'public',
        encryption_level: (data.encryption_level || 'standard') as 'standard' | 'high' | 'maximum'
      };
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return null;
    }
  }

  /**
   * Log activity for auditing
   */
  static async logActivity(action: string, resourceType: string, resourceId?: string, details?: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action_type: action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: details,
        });

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }
}

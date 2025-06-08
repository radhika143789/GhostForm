
import { supabase } from "@/integrations/supabase/client";

export interface GhostIdentity {
  id: string;
  ghost_id: string;
  nickname?: string;
  created_at: string;
  is_active: boolean;
  expiry_date?: string;
}

export class GhostIdentityService {
  /**
   * Create a new ghost identity for the current user
   */
  static async createGhostIdentity(nickname?: string, expiryDate?: Date): Promise<GhostIdentity | null> {
    try {
      // Get a new ghost ID from the server
      const { data: ghostIdData, error: ghostIdError } = await supabase.rpc('generate_ghost_id');
      
      if (ghostIdError) throw ghostIdError;
      
      const ghostId = ghostIdData;

      // Insert the new ghost identity
      const { data, error } = await supabase
        .from('ghost_identities')
        .insert({
          ghost_id: ghostId,
          nickname,
          expiry_date: expiryDate?.toISOString(),
        })
        .select('*')
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating ghost identity:', error);
      return null;
    }
  }

  /**
   * Get all ghost identities for the current user
   */
  static async getGhostIdentities(): Promise<GhostIdentity[]> {
    try {
      const { data, error } = await supabase
        .from('ghost_identities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching ghost identities:', error);
      return [];
    }
  }

  /**
   * Get a specific ghost identity by ID
   */
  static async getGhostIdentity(id: string): Promise<GhostIdentity | null> {
    try {
      const { data, error } = await supabase
        .from('ghost_identities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching ghost identity:', error);
      return null;
    }
  }

  /**
   * Update a ghost identity
   */
  static async updateGhostIdentity(id: string, updates: {
    nickname?: string;
    is_active?: boolean;
    expiry_date?: string | null;
  }): Promise<GhostIdentity | null> {
    try {
      const { data, error } = await supabase
        .from('ghost_identities')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating ghost identity:', error);
      return null;
    }
  }

  /**
   * Delete a ghost identity
   */
  static async deleteGhostIdentity(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ghost_identities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting ghost identity:', error);
      return false;
    }
  }
}

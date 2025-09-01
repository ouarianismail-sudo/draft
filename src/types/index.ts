export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          join_date: string
          type: string
          phone: string
          address: string
          email: string
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          join_date?: string
          type: string
          phone: string
          address: string
          email: string
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          join_date?: string
          type?: string
          phone?: string
          address?: string
          email?: string
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string
          name: string
          role: 'Admin' | 'Agriculteur'
          status: 'Active' | 'Suspended'
          client_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          name: string
          role: 'Admin' | 'Agriculteur'
          status: 'Active' | 'Suspended'
          client_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          name?: string
          role?: 'Admin' | 'Agriculteur'
          status?: 'Active' | 'Suspended'
          client_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          client_id: string
          type: 'in' | 'out'
          product: string
          total_weight: number
          plastic_box_count: number
          plastic_box_weight: number
          wood_box_count: number
          wood_box_weight: number
          product_weight: number
          date: string
          recorded_by_user_id: string
          comment: string | null
          farmer_comment: string | null
          is_comment_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          type: 'in' | 'out'
          product: string
          total_weight: number
          plastic_box_count?: number
          plastic_box_weight?: number
          wood_box_count?: number
          wood_box_weight?: number
          product_weight: number
          date?: string
          recorded_by_user_id: string
          comment?: string | null
          farmer_comment?: string | null
          is_comment_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          type?: 'in' | 'out'
          product?: string
          total_weight?: number
          plastic_box_count?: number
          plastic_box_weight?: number
          wood_box_count?: number
          wood_box_weight?: number
          product_weight?: number
          date?: string
          recorded_by_user_id?: string
          comment?: string | null
          farmer_comment?: string | null
          is_comment_read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Client = Database['public']['Tables']['clients']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type StockMovement = Database['public']['Tables']['stock_movements']['Row']

export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type StockMovementInsert = Database['public']['Tables']['stock_movements']['Insert']

export type ClientUpdate = Database['public']['Tables']['clients']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type StockMovementUpdate = Database['public']['Tables']['stock_movements']['Update']
export type { Database } from './database'

export type Client = Database['public']['Tables']['clients']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type StockMovement = Database['public']['Tables']['stock_movements']['Row']

export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type StockMovementInsert = Database['public']['Tables']['stock_movements']['Insert']

export type ClientUpdate = Database['public']['Tables']['clients']['Update']
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type StockMovementUpdate = Database['public']['Tables']['stock_movements']['Update']
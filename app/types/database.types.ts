export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          short_description: string
          category: string
          price: number
          sale_price: number | null
          stock: number
          featured: boolean
          best_seller: boolean
          trending: boolean
          images: string[]
          variants: Json
          tags: string[]
          rating: number
          review_count: number
          meta_title: string | null
          meta_desc: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string
          short_description?: string
          category: string
          price: number
          sale_price?: number | null
          stock?: number
          featured?: boolean
          best_seller?: boolean
          trending?: boolean
          images: string[]
          variants?: Json
          tags?: string[]
          rating?: number
          review_count?: number
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          short_description?: string
          category?: string
          price?: number
          sale_price?: number | null
          stock?: number
          featured?: boolean
          best_seller?: boolean
          trending?: boolean
          images?: string[]
          variants?: Json
          tags?: string[]
          rating?: number
          review_count?: number
          meta_title?: string | null
          meta_desc?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          title: string
          image: string
          description: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          image: string
          description?: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          image?: string
          description?: string
          order?: number
          created_at?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          id: string
          slug: string
          title: string
          subtitle: string
          image: string
          cta_label: string
          cta_href: string
          active: boolean
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          subtitle?: string
          image: string
          cta_label?: string
          cta_href?: string
          active?: boolean
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          subtitle?: string
          image?: string
          cta_label?: string
          cta_href?: string
          active?: boolean
          order?: number
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_ref: string
          user_id: string | null
          customer_name: string
          customer_phone: string
          customer_whatsapp: string
          address: string
          city: string
          state: string
          pincode: string
          notes: string
          items: Json
          subtotal: number
          shipping: number
          total: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'cod' | 'prepaid'
          whatsapp_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_ref: string
          user_id?: string | null
          customer_name: string
          customer_phone: string
          customer_whatsapp: string
          address: string
          city: string
          state: string
          pincode: string
          notes?: string
          items: Json
          subtotal: number
          shipping?: number
          total: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cod' | 'prepaid'
          whatsapp_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_ref?: string
          user_id?: string | null
          customer_name?: string
          customer_phone?: string
          customer_whatsapp?: string
          address?: string
          city?: string
          state?: string
          pincode?: string
          notes?: string
          items?: Json
          subtotal?: number
          shipping?: number
          total?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cod' | 'prepaid'
          whatsapp_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

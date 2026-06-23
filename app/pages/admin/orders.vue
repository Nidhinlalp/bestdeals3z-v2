<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
import { formatPrice } from '~/utils/format'
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const toast = useToast()

const orders = ref<Order[]>([])
const loading = ref(true)

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    orderRef: row.order_ref as string,
    userId: row.user_id as string | null,
    customerName: row.customer_name as string,
    customerPhone: row.customer_phone as string,
    customerWhatsapp: row.customer_whatsapp as string,
    address: row.address as string,
    city: row.city as string,
    state: row.state as string,
    pincode: row.pincode as string,
    notes: (row.notes as string) ?? '',
    items: (row.items as Order['items']) ?? [],
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total),
    status: row.status as OrderStatus,
    whatsappSent: Boolean(row.whatsapp_sent),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

async function refresh() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (error) throw error
    orders.value = ((data ?? []) as Record<string, unknown>[]).map(toOrder)
  } catch {
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

async function updateStatus(order: Order, status: OrderStatus) {
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (error) throw error
    order.status = status
    toast.success(`Order ${order.orderRef} → ${status}`)
  } catch {
    toast.error('Failed to update status')
  }
}

function statusClass(status: OrderStatus): string {
  return {
    pending: 'text-warning',
    confirmed: 'text-m-blue-light',
    shipped: 'text-body',
    delivered: 'text-success',
    cancelled: 'text-m-red',
  }[status] ?? 'text-body'
}

onMounted(refresh)

useSeoMeta({ title: 'Manage Orders', robots: 'noindex, nofollow' })
</script>

<template>
  <div class="flex flex-col gap-lg">
    <div class="flex flex-wrap items-end justify-between gap-md">
      <div>
        <div class="m-stripe mb-md w-16" />
        <h1 class="text-display-sm font-bold uppercase leading-none">Orders</h1>
        <p class="mt-1 text-body-sm text-body">{{ orders.length }} total</p>
      </div>
      <BaseButton variant="ghost" @click="refresh">Refresh</BaseButton>
    </div>

    <div class="border border-hairline">
      <div v-if="loading" class="grid grid-cols-1 gap-px bg-hairline">
        <div v-for="n in 8" :key="n" class="h-16 animate-pulse bg-canvas" />
      </div>
      <table v-else class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-hairline text-caption uppercase tracking-wide text-muted">
            <th class="p-md font-medium">Ref</th>
            <th class="p-md font-medium">Customer</th>
            <th class="hidden p-md font-medium sm:table-cell">Phone</th>
            <th class="hidden p-md font-medium md:table-cell">City</th>
            <th class="p-md font-medium">Total</th>
            <th class="p-md font-medium">Status</th>
            <th class="hidden p-md font-medium lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-b border-hairline last:border-0 hover:bg-surface-card">
            <td class="p-md">
              <span class="font-mono text-caption text-m-red">{{ order.orderRef }}</span>
            </td>
            <td class="p-md text-body-sm text-white">{{ order.customerName }}</td>
            <td class="hidden p-md text-body-sm text-body sm:table-cell">{{ order.customerPhone }}</td>
            <td class="hidden p-md text-body-sm text-body md:table-cell">{{ order.city }}, {{ order.state }}</td>
            <td class="p-md text-body-sm text-white">{{ formatPrice(order.total) }}</td>
            <td class="p-md">
              <select
                :value="order.status"
                class="border border-hairline bg-canvas px-2 py-1 text-caption uppercase"
                :class="statusClass(order.status)"
                @change="updateStatus(order, ($event.target as HTMLSelectElement).value as OrderStatus)"
              >
                <option v-for="s in STATUS_OPTIONS" :key="s" :value="s" class="text-white">{{ s }}</option>
              </select>
            </td>
            <td class="hidden p-md text-caption text-muted lg:table-cell">
              {{ new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) }}
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="7" class="p-xl text-center text-body-sm text-muted">No orders yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

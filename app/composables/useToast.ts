interface Toast { id: number; message: string; type: 'success' | 'error' }

let counter = 0

/** Minimal global toast queue. */
export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function push(message: string, type: Toast['type'] = 'success') {
    const id = ++counter
    toasts.value.push({ id, message, type })
    setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id) }, 3500)
  }

  return {
    toasts,
    success: (m: string) => push(m, 'success'),
    error: (m: string) => push(m, 'error'),
  }
}

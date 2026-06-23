const BUCKET = 'images'

export function useImageUpload() {
  const supabase = useSupabaseClient()

  async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase()
    const filename = `${folder}/${Date.now()}-${base}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, file, { upsert: false, contentType: file.type })

    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return data.publicUrl
  }

  return { uploadImage }
}

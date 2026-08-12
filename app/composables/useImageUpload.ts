const BUCKET = 'images'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export function useImageUpload() {
  const supabase = useSupabaseClient()

  async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error('Use a JPG, PNG, WebP or GIF image.')
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error('Image must be 5 MB or smaller.')
    }

    const ext = IMAGE_EXTENSIONS[file.type]!
    const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase() || 'image'
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'uploads'
    const filename = `${safeFolder}/${Date.now()}-${base}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, file, { upsert: false, contentType: file.type })

    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return data.publicUrl
  }

  return { uploadImage }
}

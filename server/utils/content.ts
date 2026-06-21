import { mkdir, writeFile, unlink, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { H3Event } from 'h3'
import { putFile, deleteFile, getFileSha } from './github'

export type ContentType = 'products' | 'categories' | 'banners'
const VALID: ContentType[] = ['products', 'categories', 'banners']

export function assertType(type: string): ContentType {
  if (!VALID.includes(type as ContentType)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid content type: ${type}` })
  }
  return type as ContentType
}

function safeSlug(slug: string) {
  return slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
}

function repoFilePath(type: ContentType, slug: string): string {
  return `content/${type}/${safeSlug(slug)}.md`
}

function localFilePath(type: ContentType, slug: string): string {
  return resolve(process.cwd(), repoFilePath(type, slug))
}

function localDir(type: ContentType): string {
  return resolve(process.cwd(), 'content', type)
}

// ---------------------------------------------------------------------------
// YAML serializer
// ---------------------------------------------------------------------------

function toYaml(value: unknown, indent = 0): string {
  const pad = '  '.repeat(indent)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return '\n' + value.map((item) => {
      if (item !== null && typeof item === 'object') {
        const entries = Object.entries(item as Record<string, unknown>)
        return entries
          .map(([k, v], i) => `${pad}${i === 0 ? '- ' : '  '}${k}:${formatScalarOrNest(v, indent + 2)}`)
          .join('\n')
      }
      return `${pad}- ${scalar(item)}`
    }).join('\n')
  }
  return formatScalarOrNest(value, indent)
}

function formatScalarOrNest(v: unknown, indent: number): string {
  if (Array.isArray(v)) return ' ' + toYaml(v, indent)
  return ' ' + scalar(v)
}

function scalar(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return JSON.stringify(String(v))
}

export function serializeDoc(data: Record<string, unknown>, body = ''): string {
  const lines = Object.entries(data).map(([key, val]) => {
    if (Array.isArray(val)) return `${key}:${toYaml(val, 1)}`
    return `${key}:${formatScalarOrNest(val, 1)}`
  })
  return `---\n${lines.join('\n')}\n---\n${body ? `\n${body}\n` : ''}`
}

// ---------------------------------------------------------------------------
// GitHub config (populated from runtimeConfig in production)
// ---------------------------------------------------------------------------

interface GhConfig {
  token: string
  owner: string
  repo: string
  branch: string
}

function getGhConfig(): GhConfig | null {
  const cfg = useRuntimeConfig()
  const token = cfg.githubToken
  const owner = cfg.githubOwner
  const repo = cfg.githubRepo
  const branch = (cfg.githubBranch as string) || 'main'
  if (!token || !owner || !repo) return null
  return { token, owner, repo, branch }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Create or overwrite a content document. Uses GitHub API in production, local fs in dev. */
export async function saveDoc(type: ContentType, slug: string, data: Record<string, unknown>, body = '') {
  const content = serializeDoc(data, body)
  const gh = getGhConfig()

  if (gh) {
    const path = repoFilePath(type, slug)
    const sha = await getFileSha(gh.token, gh.owner, gh.repo, path, gh.branch)
    const action = sha ? 'Update' : 'Add'
    await putFile(
      gh.token, gh.owner, gh.repo, path, gh.branch, content,
      `${action} ${type}/${slug} via admin panel`,
      sha,
    )
  } else {
    await mkdir(localDir(type), { recursive: true })
    await writeFile(localFilePath(type, slug), content, 'utf8')
  }

  return { slug }
}

/** Delete a content document. Returns false if it didn't exist. */
export async function deleteDoc(type: ContentType, slug: string): Promise<boolean> {
  const gh = getGhConfig()

  if (gh) {
    return deleteFile(
      gh.token, gh.owner, gh.repo,
      repoFilePath(type, slug),
      gh.branch,
      `Delete ${type}/${slug} via admin panel`,
    )
  } else {
    const path = localFilePath(type, slug)
    if (!existsSync(path)) return false
    await unlink(path)
    return true
  }
}

export async function docExists(type: ContentType, slug: string): Promise<boolean> {
  const gh = getGhConfig()
  if (gh) {
    const sha = await getFileSha(gh.token, gh.owner, gh.repo, repoFilePath(type, slug), gh.branch)
    return sha !== null
  }
  return existsSync(localFilePath(type, slug))
}

export async function listSlugs(type: ContentType): Promise<string[]> {
  const dir = localDir(type)
  if (!existsSync(dir)) return []
  return (await readdir(dir)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
}

/** Reject the request unless it carries the correct admin key. */
export function requireAdmin(event: H3Event) {
  const provided = getHeader(event, 'x-admin-key') ?? ''
  const expected = useRuntimeConfig().adminPassword
  if (!provided || provided !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

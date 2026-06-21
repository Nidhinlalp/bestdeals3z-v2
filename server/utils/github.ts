/**
 * GitHub Contents API helper.
 * Used by saveDoc / deleteDoc to commit content changes directly to the repo,
 * so Vercel picks them up and redeploys (~60 seconds).
 *
 * Env vars required (set in Vercel dashboard + local .env):
 *   GITHUB_TOKEN   — Personal Access Token with repo:contents write scope
 *   GITHUB_OWNER   — repo owner (username or org)
 *   GITHUB_REPO    — repo name
 *   GITHUB_BRANCH  — branch to commit to (default: main)
 */

interface GhFileResponse {
  sha?: string
  content?: string
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

function apiUrl(owner: string, repo: string, path: string) {
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
}

/** Get the current SHA of a file (needed to update it). Returns null if not found. */
export async function getFileSha(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string,
): Promise<string | null> {
  const res = await fetch(`${apiUrl(owner, repo, path)}?ref=${branch}`, {
    headers: githubHeaders(token),
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET ${path} → ${res.status}`)
  const json = (await res.json()) as GhFileResponse
  return json.sha ?? null
}

/** Create or update a file in the repo. */
export async function putFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string,
  content: string,
  message: string,
  sha?: string | null,
): Promise<void> {
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch,
  }
  if (sha) body.sha = sha

  const res = await fetch(apiUrl(owner, repo, path), {
    method: 'PUT',
    headers: githubHeaders(token),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub PUT ${path} → ${res.status}: ${text}`)
  }
}

/** Delete a file in the repo. Returns false if the file didn't exist. */
export async function deleteFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string,
  message: string,
): Promise<boolean> {
  const sha = await getFileSha(token, owner, repo, path, branch)
  if (!sha) return false

  const res = await fetch(apiUrl(owner, repo, path), {
    method: 'DELETE',
    headers: githubHeaders(token),
    body: JSON.stringify({ message, sha, branch }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub DELETE ${path} → ${res.status}: ${text}`)
  }
  return true
}

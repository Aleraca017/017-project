// lib/github.js
export async function fetchGithubMarkdown(owner, repo, path = "README.md") {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw", // pega o conteúdo bruto
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar doc: ${res.statusText}`);
  }

  return res.text();
}

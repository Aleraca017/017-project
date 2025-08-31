import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const repoUrl = url.searchParams.get("url");

    if (!repoUrl) {
      return NextResponse.json({ error: "URL do repositório não informada" }, { status: 400 });
    }

    // Extrair owner e repo da URL do GitHub
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const owner = match[1];
    const repo = match[2];

    const token = process.env.GITHUB_PAT;

    // Buscar README usando GitHub API
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.raw"
      }
    });

    if (!res.ok) throw new Error(`Erro ao buscar README: ${res.status} ${res.statusText}`);

    const text = await res.text();

    return NextResponse.json({ content: text }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

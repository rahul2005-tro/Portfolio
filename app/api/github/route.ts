import { NextResponse } from "next/server";
import { repoMetadata } from "@/data/profile";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/rahul2005-tro/repos?sort=updated&per_page=20",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "rahul-portfolio",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();

    const repos = data
      .filter((repo: { fork: boolean }) => !repo.fork)
      .map(
        (repo: {
          id: number;
          name: string;
          description: string | null;
          html_url: string;
          homepage: string | null;
          language: string | null;
          stargazers_count: number;
          forks_count: number;
          topics: string[];
        }) => {
          const meta = repoMetadata[repo.name] || {};
          return {
            id: repo.id,
            name: repo.name,
            description: meta.description || repo.description || "No description provided.",
            html_url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            topics: repo.topics || [],
            techStack: meta.techStack || (repo.language ? [repo.language] : []),
          };
        }
      );

    return NextResponse.json(repos);
  } catch {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}

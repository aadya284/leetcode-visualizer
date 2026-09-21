import { NormalizedProblem } from "./types";

export function deduplicateProblems(
  problems: NormalizedProblem[]
): NormalizedProblem[] {
  const seenKeys = new Set<string>();
  const seenSlugs = new Set<string>();
  const uniqueList: NormalizedProblem[] = [];

  for (const problem of problems) {
    const key = `${problem.platform.toLowerCase()}:${problem.platformProblemId.toLowerCase()}`;

    // Skip duplicate platform + platformProblemId in the same batch
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);

    // Ensure unique slug within the batch
    let uniqueSlug = problem.slug;
    let counter = 1;
    while (seenSlugs.has(uniqueSlug)) {
      counter++;
      uniqueSlug = `${problem.slug}-${counter}`;
    }
    seenSlugs.add(uniqueSlug);

    uniqueList.push({
      ...problem,
      slug: uniqueSlug,
    });
  }

  return uniqueList;
}

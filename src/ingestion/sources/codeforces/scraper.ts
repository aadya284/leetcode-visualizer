export interface ParsedCodeforcesStatement {
  description: string;
  timeLimit?: string;
  memoryLimit?: string;
  inputSpecification?: string;
  outputSpecification?: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
}

export async function fetchCodeforcesProblemDetails(
  contestId: number | string,
  index: string
): Promise<ParsedCodeforcesStatement | null> {
  try {
    const url = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    const html = await res.text();

    // Extract time limit
    const timeLimitMatch = html.match(/time limit per test<\/div>\s*([^\<]+)/i);
    const timeLimit = timeLimitMatch ? timeLimitMatch[1].trim() : undefined;

    // Extract memory limit
    const memLimitMatch = html.match(/memory limit per test<\/div>\s*([^\<]+)/i);
    const memoryLimit = memLimitMatch ? memLimitMatch[1].trim() : undefined;

    // Extract problem statement body
    let statementText = "";
    const statementMatch = html.match(
      /<div class="header">[\s\S]*?<\/div><div>([\s\S]*?)<\/div><div class="input-specification">/i
    );
    if (statementMatch) {
      statementText = cleanHtmlToText(statementMatch[1]);
    }

    // Extract input specification
    let inputSpec = "";
    const inputMatch = html.match(
      /<div class="input-specification">[\s\S]*?<div class="section-title">Input<\/div>([\s\S]*?)<\/div>/i
    );
    if (inputMatch) {
      inputSpec = cleanHtmlToText(inputMatch[1]);
    }

    // Extract output specification
    let outputSpec = "";
    const outputMatch = html.match(
      /<div class="output-specification">[\s\S]*?<div class="section-title">Output<\/div>([\s\S]*?)<\/div>/i
    );
    if (outputMatch) {
      outputSpec = cleanHtmlToText(outputMatch[1]);
    }

    // Extract sample tests
    const examples: Array<{ input: string; output: string; explanation?: string }> = [];
    const sampleInputMatches = Array.from(
      html.matchAll(/<div class="input">[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi)
    );
    const sampleOutputMatches = Array.from(
      html.matchAll(/<div class="output">[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi)
    );

    for (let i = 0; i < Math.min(sampleInputMatches.length, sampleOutputMatches.length); i++) {
      const inRaw = cleanHtmlToText(sampleInputMatches[i][1]);
      const outRaw = cleanHtmlToText(sampleOutputMatches[i][1]);
      if (inRaw || outRaw) {
        examples.push({
          input: inRaw,
          output: outRaw,
        });
      }
    }

    // Extract note / explanation
    const noteMatch = html.match(
      /<div class="note">[\s\S]*?<div class="section-title">Note<\/div>([\s\S]*?)<\/div>/i
    );
    if (noteMatch && examples.length > 0) {
      examples[0].explanation = cleanHtmlToText(noteMatch[1]);
    }

    const constraints: string[] = [];
    if (timeLimit) constraints.push(`Time Limit: ${timeLimit}`);
    if (memoryLimit) constraints.push(`Memory Limit: ${memoryLimit}`);
    if (inputSpec) constraints.push(inputSpec.slice(0, 150));

    // Construct full rich markdown description
    let fullDescription = statementText || `Codeforces Problem ${contestId}${index}`;

    if (inputSpec) {
      fullDescription += `\n\n### Input\n${inputSpec}`;
    }

    if (outputSpec) {
      fullDescription += `\n\n### Output\n${outputSpec}`;
    }

    return {
      description: fullDescription,
      timeLimit,
      memoryLimit,
      inputSpecification: inputSpec,
      outputSpecification: outputSpec,
      examples,
      constraints,
    };
  } catch {
    return null;
  }
}

function cleanHtmlToText(html: string): string {
  return html
    .replace(/<div class="test-example-line[^"]*">/gi, "\n")
    .replace(/<\/div>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p>/gi, "\n\n")
    .replace(/<\/p>/gi, "")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&le;/gi, "<=")
    .replace(/&ge;/gi, ">=")
    .replace(/<[^>]+>/g, "")
    .trim();
}

import axios from "axios";

export interface FetchedLeetCodeDetails {
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
}

/**
 * Clean LeetCode HTML content into rich formatted text, examples, and constraints.
 */
export function parseLeetCodeHtmlContent(html: string): FetchedLeetCodeDetails {
  if (!html) {
    return { description: "", examples: [], constraints: [] };
  }

  // Normalize HTML
  let clean = html
    .replace(/<strong class="example">Example (\d+):?<\/strong>/gi, "### EXAMPLE_SPLIT ###")
    .replace(/<strong>Example (\d+):?<\/strong>/gi, "### EXAMPLE_SPLIT ###")
    .replace(/<p><strong>Example (\d+):?<\/strong><\/p>/gi, "### EXAMPLE_SPLIT ###")
    .replace(/<p><strong class="example">Example (\d+):?<\/strong><\/p>/gi, "### EXAMPLE_SPLIT ###")
    .replace(/<p><strong>Constraints:?<\/strong><\/p>/gi, "### CONSTRAINTS_SPLIT ###")
    .replace(/<strong>Constraints:?<\/strong>/gi, "### CONSTRAINTS_SPLIT ###");

  // Split into Description, Examples, Constraints
  let descriptionPart = clean;
  let examplesPart = "";
  let constraintsPart = "";

  if (clean.includes("### CONSTRAINTS_SPLIT ###")) {
    const parts = clean.split("### CONSTRAINTS_SPLIT ###");
    clean = parts[0];
    constraintsPart = parts[1] || "";
  }

  if (clean.includes("### EXAMPLE_SPLIT ###")) {
    const parts = clean.split("### EXAMPLE_SPLIT ###");
    descriptionPart = parts[0];
    examplesPart = parts.slice(1).join("### EXAMPLE_SPLIT ###");
  } else {
    descriptionPart = clean;
  }

  // Parse Description
  const description = cleanHtmlToText(descriptionPart);

  // Parse Examples
  const examples: { input: string; output: string; explanation?: string }[] = [];
  if (examplesPart) {
    const rawExamples = examplesPart.split("### EXAMPLE_SPLIT ###");
    for (const rawEx of rawExamples) {
      const text = cleanHtmlToText(rawEx);
      if (!text) continue;

      let input = "";
      let output = "";
      let explanation = "";

      // Regex matching with flexible line breaks
      const inputMatch = text.match(/Input:\s*([\s\S]*?)(?=Output:|$)/i);
      const outputMatch = text.match(/Output:\s*([\s\S]*?)(?=Explanation:|$)/i);
      const explMatch = text.match(/Explanation:\s*([\s\S]*?)$/i);

      if (inputMatch) {
        input = inputMatch[1].replace(/^\*+|\*+$/g, "").trim();
      }
      if (outputMatch) {
        output = outputMatch[1].replace(/^\*+|\*+$/g, "").trim();
      }
      if (explMatch) {
        explanation = explMatch[1].replace(/^\*+|\*+$/g, "").trim();
      }

      if (input && output) {
        examples.push({
          input,
          output,
          explanation: explanation || undefined,
        });
      }
    }
  }

  // Parse Constraints
  const constraints: string[] = [];
  if (constraintsPart) {
    const liMatches = constraintsPart.match(/<li>([\s\S]*?)<\/li>/gi);
    if (liMatches && liMatches.length > 0) {
      for (const li of liMatches) {
        const cText = cleanHtmlToText(li).replace(/^[-*•]\s*/, "").trim();
        if (cText) constraints.push(cText);
      }
    } else {
      const lines = cleanHtmlToText(constraintsPart).split("\n");
      for (const line of lines) {
        const trimmed = line.trim().replace(/^[-*•]\s*/, "");
        if (trimmed) constraints.push(trimmed);
      }
    }
  }

  return {
    description,
    examples,
    constraints,
  };
}

function cleanHtmlToText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<pre>([\s\S]*?)<\/pre>/gi, "\n$1\n")
    .replace(/<strong.*?>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b.*?>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em.*?>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i.*?>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<p.*?>/gi, "\n\n")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<ul.*?>|<\/ul>|<ol.*?>|<\/ol>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&le;/g, "<=")
    .replace(/&ge;/g, ">=")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Fetch official problem details directly from LeetCode official GraphQL API
 */
export async function fetchLeetCodeOfficialDetails(titleSlug: string): Promise<FetchedLeetCodeDetails | null> {
  try {
    const query = `
      query questionContent($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
        }
      }
    `;

    const res = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        variables: { titleSlug },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 7000,
      }
    );

    const content = res.data?.data?.question?.content;
    if (!content) return null;

    return parseLeetCodeHtmlContent(content);
  } catch (error) {
    return null;
  }
}

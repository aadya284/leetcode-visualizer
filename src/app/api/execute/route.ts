import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

export async function POST(request: NextRequest) {
  try {
    const { code, language, languageName } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // If no API key is configured, return a mock response
    if (!RAPIDAPI_KEY) {
      return NextResponse.json({
        output: `Mock execution for ${languageName}:\n\nCode received:\n${code}\n\n✓ Code compiled successfully (demo mode)\n\nNote: Configure RAPIDAPI_KEY environment variable to use Judge0 API for real code execution.`,
        status: { description: "Accepted" },
      });
    }

    // Submit code to Judge0
    const submissionResponse = await axios.post(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: language,
        stdin: "",
      },
      {
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const result = submissionResponse.data;

    // Handle compilation errors
    if (result.compile_output) {
      return NextResponse.json({
        error: result.compile_output,
        status: result.status,
      });
    }

    // Handle runtime errors
    if (result.stderr) {
      return NextResponse.json({
        error: result.stderr,
        status: result.status,
      });
    }

    // Return successful output
    return NextResponse.json({
      output: result.stdout || "No output",
      status: result.status,
    });
  } catch (error: any) {
    console.error("Code execution error:", error);
    
    return NextResponse.json(
      {
        error: error.response?.data?.error || "Failed to execute code. Please try again.",
      },
      { status: 500 }
    );
  }
}

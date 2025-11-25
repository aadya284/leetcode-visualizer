const axios = require('axios');
require('dotenv').config();

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

async function executeCode({ languageId, code, input }) {
  if (!RAPIDAPI_KEY) {
    return {
      stdout: 'Mock Output',
      stderr: '',
      time: '0.002',
      memory: 1024
    };
  }

  try {
    const response = await axios.post(
      JUDGE0_API_URL + '?base64_encoded=true&wait=true',
      {
        source_code: Buffer.from(code).toString('base64'),
        language_id: languageId,
        stdin: input || ''
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      }
    );
    const { stdout, stderr, compile_output, time, memory } = response.data;
    
    // Decode base64 fields if they exist
    const decodeBase64 = (str) => {
      if (!str) return "";
      try {
        return Buffer.from(str, 'base64').toString('utf-8');
      } catch {
        return str;
      }
    };

    return {
      stdout: decodeBase64(stdout),
      stderr: decodeBase64(stderr),
      compile_output: decodeBase64(compile_output),
      time,
      memory
    };
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = { executeCode };

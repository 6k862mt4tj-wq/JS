
import {AI_MODEL} from "./config.js";
import {GEMINI_API_KEY} from "./config.js";



//
export async function askAi(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error('API key not found');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;


    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-goog-api-key": GEMINI_API_KEY
            },
            body: JSON.stringify(
                {
                    contents: {"parts": [{"text": prompt}]},
                }
            ),
        });
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini error:', errorData);
        throw new Error('Gemini error');
    }

    const data = await response.json();
    const answer = data?.candidates[0]?.content.parts[0]?.text;
    if (!answer) {
        throw new Error('No answer from Gemini');
    }

    return answer;
}

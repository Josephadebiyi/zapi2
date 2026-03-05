const { OpenAI } = require('openai');
const env = require('../config/env');

let openai;
if (env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

// Ensure the schema matches the structured output requirements exactly.
const intentExtractionSchema = {
    name: "extract_booking_intent",
    schema: {
        type: "object",
        properties: {
            language: {
                type: "string",
                enum: ["es", "en"],
                description: "The language of the user message (Spanish or English)."
            },
            intent: {
                type: "string",
                enum: [
                    "search_service",
                    "book_appointment",
                    "select_date",
                    "select_time",
                    "confirm_booking",
                    "cancel_booking",
                    "reschedule_booking",
                    "complaint",
                    "help"
                ],
                description: "The core intent of the user message."
            },
            entities: {
                type: "object",
                properties: {
                    service: { type: "string" },
                    location: { type: "string" },
                    date: { type: "string", description: "Format: YYYY-MM-DD if possible" },
                    time: { type: "string", description: "Format: HH:mm if possible" },
                    booking_id: { type: "string" }
                },
                description: "Extracted entities relevant to the intent. Leave empty string if not found."
            }
        },
        required: ["language", "intent", "entities"],
        additionalProperties: false
    }
};

const extractIntent = async (userMessage, personality = 'professional') => {
    if (!openai) {
        console.warn("OpenAI API key missing, returning mock intent");
        return {
            language: "es",
            intent: "help",
            entities: { service: "", location: "", date: "", time: "", booking_id: "" }
        };
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant for ZAPI, a WhatsApp-first appointment booking system in Spain. Your job is to extract the user's intent, language, and any relevant entities from their messages.
                    Current business personality: ${personality}. 
                    - 'professional': polite, concise, efficient.
                    - 'casual': friendly, uses emojis, warm.
                    - 'bilingual': switches between Spanish and English naturally as needed.
                    You MUST output strictly adhering to the JSON schema provided.`
                },
                { role: "user", content: userMessage }
            ],
            response_format: {
                type: "json_schema",
                json_schema: intentExtractionSchema
            },
            temperature: 0.1
        });

        const resultRaw = completion.choices[0].message.content;
        const parsed = JSON.parse(resultRaw);
        return parsed;
    } catch (error) {
        console.error("OpenAI Intent Extraction Error:", error);
        // Fallback on error - return default help intent instead of null
        return {
            language: "es",
            intent: "help",
            entities: { service: "", location: "", date: "", time: "", booking_id: "" }
        };
    }
};

module.exports = {
    extractIntent
};

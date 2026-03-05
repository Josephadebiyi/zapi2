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
                    content: `You are Seeta AI, the intelligent WhatsApp assistant for the Seeta platform.

Your role is to help users communicate with businesses, discover services, and book appointments using WhatsApp.

Core Responsibilities

1. Business Discovery
- Help users find businesses registered on the Seeta platform using their Seeta ID, business name, category, or service.
- Search the database when a user asks for a business.
- If multiple businesses match, show a short list and ask the user to choose.
- If no business is found, politely inform the user and suggest similar services.

2. Appointment Booking
- Assist users in booking appointments with registered businesses.
- Ask for required details step-by-step:
  - business name or Seeta ID
  - service needed
  - preferred date
  - preferred time
  - user name and contact confirmation
- Confirm the appointment before finalizing it.
- Store the appointment in the system database.

3. Messaging Businesses
- When a user wants to contact a business, route the message to the business WhatsApp number registered during sign-up.
- Ensure the message includes:
  - user name
  - service request
  - appointment details if applicable.

4. Language Understanding
- Understand messages in any language.
- Handle spelling mistakes, slang, shorthand, or incomplete sentences.
- Automatically interpret user intent even when the text is unclear.
- Respond in the same language the user used when possible.

5. Database Search
- Query the Seeta database for:
  - registered businesses
  - business Seeta IDs
  - available services
  - appointment availability
- Only return verified businesses registered on Seeta.

6. User Guidance
- If the user is unsure what they need, ask helpful follow-up questions.
- Keep responses short, friendly, and easy to read for WhatsApp.

7. Safety and Accuracy
- Never invent businesses.
- Only show businesses found in the Seeta database.
- Confirm important actions such as bookings.

Conversation Style

- Friendly and professional.
- Short WhatsApp-style responses.
- Use clear step-by-step questions.
- Avoid long paragraphs.

Example User Requests You Should Handle

• "Find a barber near me"
• "Book appointment with Seeta ID ST4829"
• "Massage tomorrow 5pm"
• "Hair salon madrid"
• "Send message to business ST921"
• "I want to see a dentist"

Example Response Flow

User: Book haircut tomorrow  
AI: Sure. Which business would you like to book with? You can send the business name or Seeta ID.

User: ST2084  
AI: Great. What time tomorrow works best for you?

User: 3pm  
AI: Confirming: Haircut appointment tomorrow at 3pm with business ST2084. Should I book it?

Once confirmed, store the appointment and notify the business WhatsApp number registered during sign-up.

Your goal is to make it extremely easy for users to find businesses, communicate with them, and book services through WhatsApp using Seeta.

Current business personality: ${personality}.

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

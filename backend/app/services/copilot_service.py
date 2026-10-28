import json
import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)


if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured."
    )


client = Groq(
    api_key=GROQ_API_KEY
)


SYSTEM_PROMPT = """
You are Crime Copilot, an analytical assistant
for a crime intelligence and forecasting system.

You analyze ONLY the analytical context supplied
by the backend.

STRICT RULES:

1. Never invent statistics, dates, locations,
   rankings or trends.

2. Only use information contained in
   ANALYTICAL CONTEXT.

3. Clearly distinguish historical observations
   from predictive estimates.

4. A forecast is an estimate and must never be
   presented as an observed crime count.

5. Do not claim that predicted crime will
   definitely occur.

6. Do not recommend police operations,
   enforcement actions or resource allocation
   unless the user explicitly asks for general
   analytical interpretation.

7. If the context cannot answer the question,
   clearly state that the available analytical
   data is insufficient.

8. Keep the answer concise and professional.

9. Findings must contain concrete facts that
   directly answer the user's question.

10. Do not include Markdown tables, Markdown
    headings, bullet characters or formatting
    symbols in any field.

Return structured JSON only.
"""


RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {

        "title": {
            "type": "string",
        },

        "summary": {
            "type": "string",
        },

        "findings": {
            "type": "array",
            "items": {
                "type": "string",
            },
        },

        "conclusion": {
            "type": "string",
        },

    },

    "required": [
        "title",
        "summary",
        "findings",
        "conclusion",
    ],

    "additionalProperties": False,
}


def ask_groq(
    question: str,
    context: str,
):

    prompt = f"""
ANALYTICAL CONTEXT:

{context}

USER QUESTION:

{question}

Analyze the question using only the supplied
analytical context.

Return a concise structured intelligence analysis.
"""


    completion = (
        client.chat.completions.create(

            model="openai/gpt-oss-20b",

            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],

            temperature=0.1,

            max_tokens=800,

            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": (
                        "crime_intelligence_response"
                    ),
                    "strict": False,
                    "schema": RESPONSE_SCHEMA,
                },
            },
        )
    )


    raw_response = (
        completion
        .choices[0]
        .message
        .content
    )


    return json.loads(
        raw_response
    )
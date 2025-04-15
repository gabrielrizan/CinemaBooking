
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings

from google import genai
from google.genai import types

# Initialize the Gemini client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

@csrf_exempt
def gemini_chat_view(request):
    """A Django view that calls Gemini for text generation."""
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests allowed.")

    try:
        body = json.loads(request.body)
        user_message = body.get("message")

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)
        
        config = types.GenerateContentConfig(
            max_output_tokens=50,             # Force shorter responses
            temperature=0.2,                  # More deterministic
            system_instruction="You are a cinema application chatbot. You must keep answers brief."  # Extra nudge
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_message,
            config=config,
        )


        gemini_reply = response.text

        return JsonResponse({"reply": gemini_reply})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

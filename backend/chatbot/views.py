
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from catalog.models import Movie

from google import genai
from google.genai.types import (
    GenerateContentConfig,
    Part,
    UserContent,
    ModelContent,
)



client = genai.Client(api_key=settings.GEMINI_API_KEY)


def get_now_playing_summary():
    now_playing_movies = Movie.objects.filter(nowPlaying=True)
    if not now_playing_movies.exists():
        return "No movies are currently playing."

    summary_lines = []
    for movie in now_playing_movies:
        summary_lines.append(
            f"• {movie.title} ({movie.genre}, rated {movie.rating}, {movie.runtime} min)"
        )

    return "\n".join(summary_lines)

@csrf_exempt
def gemini_chat_view(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests allowed.")

    try:
        body = json.loads(request.body)
        history = body.get("messages", [])      
        new_message = body.get("newMessage")
        if not new_message:
            return JsonResponse({"error": "No newMessage provided"}, status=400)

        config = GenerateContentConfig(
            max_output_tokens=150,
            temperature=0.2,
            system_instruction=(
                "You are a helpful cinema chatbot. Answer the user's questions about movies all the movies, not just the ones that are showing."
                "If the user asks about the movies running, here are the movies currently playing:\n"
                f"{get_now_playing_summary()}"
                "Even if the user asks about information other tahan genre, ratting or runtime, you should answer them with your knowledge."

            )
        )

        history_contents = []
        for turn in history:
            part = Part(text=turn["content"])
            if turn["role"] == "user":
                history_contents.append(UserContent(parts=[part]))
            else:
                history_contents.append(ModelContent(parts=[part]))

        chat = client.chats.create(
            model="gemini-2.0-flash",
            config=config,
            history=history_contents,          
        )

        response = chat.send_message(new_message)
        return JsonResponse({"reply": response.text})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
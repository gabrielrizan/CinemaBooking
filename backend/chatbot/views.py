
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from django.conf import settings
from catalog.models import Movie

from google import genai
from google.genai import types



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

    now_playing_info = get_now_playing_summary()
    if request.method != 'POST':
        return HttpResponseBadRequest("Only POST requests allowed.")

    try:
        body = json.loads(request.body)
        user_message = body.get("message")

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)
        
        config = types.GenerateContentConfig(
            max_output_tokens=150,             
            temperature=1,                  
            system_instruction=(
        "You are a helpful cinema chatbot. "
        "Do not answer questions that are not related to movies/tv series."
        "Below is a list of movies currently playing in OUR cinema:\n"
        f"{now_playing_info}\n"
        "Answer user questions about these movies, and other general queries.If a user asks about other movies or upcoming, answer the question."
    )  # Extra nudge
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

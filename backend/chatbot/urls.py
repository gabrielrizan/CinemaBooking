from django.urls import path
from . import views

urlpatterns = [
    path('ask/', views.gemini_chat_view, name='chat_with_bot'),
]

from django.contrib import admin
from django.urls import path, include
from account.views import home
from payments import views


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/' , include('account.urls')),
    path('api/payments/', include('payments.urls')),  # Payments-related routes
    path('api/tickets/', include('tickets.urls')),
    path('api/catalog/', include('catalog.urls')),
]

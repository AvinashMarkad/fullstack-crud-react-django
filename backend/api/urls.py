from django.urls import path
from . import views

urlpatterns = [
    # API Endpoint
    path('students/', views.studentView),
    path('students/<int:pk>/', views.studentDetailView)
]
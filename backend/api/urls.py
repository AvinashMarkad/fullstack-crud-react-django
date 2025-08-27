from django.urls import path
from . import views


urlpatterns = [
    # API Endpoint
    path('students/', views.studentView),
    path('students/<int:pk>/', views.studentDetailView),

    path('employees/', views.EmployeeAPIView.as_view()),
    path('employees/<int:pk>/', views.EmployeeDetails.as_view()),

    path('blogs/',views.BlogView.as_view()),
    path('comments/',views.CommentView.as_view()),

    path('blogs/<int:pk>/',views.BlogDetailView.as_view()),
    path('comments/<int:pk>/',views.CommentDetailView.as_view())
]
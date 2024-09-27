from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import RegistrationView, LoginView, ChangePasswordView, ProfileView, ProfileUpdateView, ProfileCreateView

urlpatterns = [
        path('Registration/', RegistrationView.as_view(), name="Registration Endpoint"),
        path('login/', LoginView.as_view(), name='Login Endpoint'),
        path('change-password/', ChangePasswordView.as_view(), name='Change Password Endpoint'),
        path('profile/<str:username>/', ProfileView.as_view(), name='User Profile Endpoint'),
        path('profile-create/', ProfileCreateView.as_view(), name='User Profile Create Endpoint'),
        path('profile/update/<str:username>/', ProfileUpdateView.as_view(), name='User Profile Update Endpoint'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

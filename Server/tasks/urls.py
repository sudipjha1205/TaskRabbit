from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import CreateTasksView, GetTasksView

urlpatterns = [
        path('create-task/',CreateTasksView,name='CREATE TASK ENDPOINT'),
        path('get-tasks/<str:employee_id>/',GetTasksView, name='GET TASKS ENDPOINT'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


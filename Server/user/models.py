from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name = 'profile')
    designation = models.CharField(max_length=255,null=False)
    profile_picture = models.ImageField(upload_to='profile_pics/',blank=True,null=True)
    joined_at = models.DateTimeField(auto_now=True)



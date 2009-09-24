
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

@login_required
def profile(request):
    data = {}
    data["user"] = request.user
    data["username"] = request.user.username
             
    return render_to_response("accounts/profile.htm", data)

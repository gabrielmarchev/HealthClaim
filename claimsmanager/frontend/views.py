from django.shortcuts import render

#this is where we point to the template
def index(request):
    return render(request, 'frontend/index.html')

from django.shortcuts import render, redirect

def main_page(request):
    if request.user.is_authenticated:
        return redirect('/app')
    return render(request, 'index.html')
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import translation
import json

@csrf_exempt
def set_language(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        language = data.get('language')
        if not language or language not in ['en', 'fr', 'es', 'ru', 'de', 'zh', 'uk']:
            return JsonResponse({'error': 'Invalid language'}, status=400)
        
        request.session['django_language'] = language
        translation.activate(language)
        return JsonResponse({'success': True})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
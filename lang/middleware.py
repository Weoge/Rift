from django.utils import translation

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        language = request.COOKIES.get('language') or request.session.get('django_language', 'ru')
        translation.activate(language)
        request.LANGUAGE_CODE = language
        response = self.get_response(request)
        return response

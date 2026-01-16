from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import os

@login_required
def get_turn_config(request):
    return JsonResponse({
        'iceServers': [
            {'urls': 'stun:stun.l.google.com:19302'},
            {'urls': f'stun:{os.environ.get("TURN_SERVER_HOST", "localhost")}:3478'},
            {
                'urls': f'turn:{os.environ.get("TURN_SERVER_HOST", "localhost")}:3478',
                'username': os.environ.get('TURN_USERNAME', ''),
                'credential': os.environ.get('TURN_PASSWORD', '')
            },
            {
                'urls': f'turn:{os.environ.get("TURN_SERVER_HOST", "localhost")}:3478?transport=tcp',
                'username': os.environ.get('TURN_USERNAME', ''),
                'credential': os.environ.get('TURN_PASSWORD', '')
            }
        ]
    })

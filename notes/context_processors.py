from django.conf import settings
import os


def is_placeholder_value(value):
    placeholders = [
        'your-google-client-id-here.apps.googleusercontent.com',
        'your-google-client-secret-here',
        'your-google-client-id-here',
        'your-google-client-secret-here',
    ]
    return value.strip().lower() in placeholders


def oauth_status(request):
    """Check if Google OAuth is properly configured"""
    client_id = getattr(settings, 'SOCIAL_AUTH_GOOGLE_CLIENT_ID', '')
    client_secret = getattr(settings, 'SOCIAL_AUTH_GOOGLE_SECRET', '')

    env_file_exists = os.path.exists(os.path.join(settings.BASE_DIR.parent, '.env'))
    oauth_ready = bool(client_id and client_secret) and not (is_placeholder_value(client_id) or is_placeholder_value(client_secret))
    oauth_issue = None
    if not env_file_exists:
        oauth_issue = 'missing_env'
    elif not client_id or not client_secret:
        oauth_issue = 'empty_values'
    elif is_placeholder_value(client_id) or is_placeholder_value(client_secret):
        oauth_issue = 'placeholder_values'

    return {
        'google_oauth_ready': oauth_ready,
        'google_oauth_configured': oauth_ready,
        'env_file_exists': env_file_exists,
        'oauth_issue': oauth_issue,
    }

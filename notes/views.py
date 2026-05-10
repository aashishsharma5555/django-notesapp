from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from .models import Note


def index(request):
    """Display the main notes page"""
    notes = Note.objects.all()
    return render(request, 'notes/index.html', {'notes': notes})

@require_http_methods(["GET"])
def get_notes(request):
    """Get all notes as JSON"""
    notes = Note.objects.all().values('id', 'title', 'content', 'created_at', 'updated_at')
    return JsonResponse(list(notes), safe=False)

@require_http_methods(["POST"])
def create_note(request):
    """Create a new note"""
    try:
        data = json.loads(request.body)
        title = data.get('title', 'Untitled')
        content = data.get('content', '')
        
        note = Note.objects.create(title=title, content=content)
        
        return JsonResponse({
            'success': True,
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'created_at': note.created_at.isoformat(),
            'updated_at': note.updated_at.isoformat()
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["POST"])
def update_note(request, note_id):
    """Update an existing note"""
    try:
        note = get_object_or_404(Note, id=note_id)
        data = json.loads(request.body)
        
        if 'title' in data:
            note.title = data['title']
        if 'content' in data:
            note.content = data['content']
        
        note.save()
        
        return JsonResponse({
            'success': True,
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'created_at': note.created_at.isoformat(),
            'updated_at': note.updated_at.isoformat()
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["DELETE"])
def delete_note(request, note_id):
    """Delete a note"""
    try:
        note = get_object_or_404(Note, id=note_id)
        note.delete()
        
        return JsonResponse({'success': True, 'message': 'Note deleted successfully'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["GET"])
def get_note(request, note_id):
    """Get a single note as JSON"""
    try:
        note = get_object_or_404(Note, id=note_id)
        return JsonResponse({
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'created_at': note.created_at.isoformat(),
            'updated_at': note.updated_at.isoformat()
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


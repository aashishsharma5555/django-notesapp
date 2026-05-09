# 📡 Django Notes App - API Documentation

## Overview

The Notes App provides a RESTful JSON API for managing notes. All endpoints return JSON responses and support standard HTTP methods (GET, POST, DELETE).

**Base URL**: `http://localhost:8000/api/`

---

## Authentication

⚠️ **Current Version**: No authentication required (development mode)

For production, implement JWT or session-based authentication.

---

## API Endpoints

### 1. Get All Notes

**Endpoint:**
```
GET /api/notes/
```

**Description:** Retrieve a list of all notes in the database

**Request:**
```bash
curl http://localhost:8000/api/notes/
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "title": "My First Note",
        "content": "This is the content of my first note",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:35:00Z"
    },
    {
        "id": 2,
        "title": "Second Note",
        "content": "Another important note",
        "created_at": "2024-01-15T11:00:00Z",
        "updated_at": "2024-01-15T11:15:00Z"
    }
]
```

**Response (500 Error):**
```json
{
    "success": false,
    "error": "Database connection error"
}
```

---

### 2. Get Single Note

**Endpoint:**
```
GET /api/notes/{id}/
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | integer (path) | Unique note identifier |

**Request:**
```bash
curl http://localhost:8000/api/notes/1/
```

**Response (200 OK):**
```json
{
    "id": 1,
    "title": "My First Note",
    "content": "This is the content of my first note",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
}
```

**Response (404 Not Found):**
```json
{
    "success": false,
    "error": "Note matching query does not exist."
}
```

---

### 3. Create Note

**Endpoint:**
```
POST /api/notes/create/
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "My New Note",
    "content": "This is the content of my new note"
}
```

**Request Examples:**

cURL:
```bash
curl -X POST http://localhost:8000/api/notes/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Note",
    "content": "Note content here"
  }'
```

JavaScript (Fetch API):
```javascript
fetch('/api/notes/create/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: 'New Note',
        content: 'Note content'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

Python (Requests):
```python
import requests

data = {
    'title': 'My New Note',
    'content': 'Note content'
}

response = requests.post('http://localhost:8000/api/notes/create/', json=data)
print(response.json())
```

**Response (201 Created):**
```json
{
    "success": true,
    "id": 3,
    "title": "My New Note",
    "content": "This is the content of my new note",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
    "success": false,
    "error": "Invalid JSON format"
}
```

---

### 4. Update Note

**Endpoint:**
```
POST /api/notes/{id}/update/
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | integer (path) | Unique note identifier |

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "title": "Updated Title",
    "content": "Updated content here"
}
```

**Note**: You can update one or both fields. Fields not included are not modified.

**Request Examples:**

cURL (Update both fields):
```bash
curl -X POST http://localhost:8000/api/notes/1/update/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

cURL (Update only title):
```bash
curl -X POST http://localhost:8000/api/notes/1/update/ \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title"}'
```

JavaScript:
```javascript
fetch('/api/notes/1/update/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: 'Updated Title',
        content: 'Updated content'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

**Response (200 OK):**
```json
{
    "success": true,
    "id": 1,
    "title": "Updated Title",
    "content": "Updated content here",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T12:30:00Z"
}
```

**Response (400 Bad Request):**
```json
{
    "success": false,
    "error": "Note matching query does not exist."
}
```

---

### 5. Delete Note

**Endpoint:**
```
DELETE /api/notes/{id}/delete/
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | integer (path) | Unique note identifier |

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/notes/1/delete/
```

**JavaScript:**
```javascript
fetch('/api/notes/1/delete/', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response => response.json())
.then(data => console.log(data));
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Note deleted successfully"
}
```

**Response (400 Bad Request):**
```json
{
    "success": false,
    "error": "Note matching query does not exist."
}
```

---

## Response Format

### Success Response
```json
{
    "success": true,
    "id": 1,
    "title": "...",
    "content": "...",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Error description"
}
```

---

## Data Types

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | integer | Unique identifier (auto-generated) | 1 |
| `title` | string | Note title (max 200 chars) | "My Note" |
| `content` | string | Note content (unlimited) | "Note details..." |
| `created_at` | ISO 8601 | Creation timestamp (auto) | "2024-01-15T10:30:00Z" |
| `updated_at` | ISO 8601 | Last update timestamp (auto) | "2024-01-15T12:30:00Z" |

---

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK - Request successful | GET, POST, DELETE success |
| 201 | Created - Resource created | POST /create/ |
| 400 | Bad Request - Invalid data | Invalid JSON, missing fields |
| 404 | Not Found - Note doesn't exist | Invalid note ID |
| 500 | Server Error - Database error | Connection failure |

---

## Rate Limiting

⚠️ **Current Version**: No rate limiting

Recommended for production: 100 requests per minute per IP

---

## Error Handling

All errors follow this format:

```json
{
    "success": false,
    "error": "Error description"
}
```

Common errors:

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid JSON format | Malformed request body | Check JSON syntax |
| Note matching query does not exist | Wrong note ID | Use correct ID from list |
| Database connection error | MySQL not running | Start MySQL service |
| Access denied | Database credentials | Update settings.py |

---

## Usage Examples

### Example 1: Complete CRUD Workflow

```javascript
// 1. Create a note
const createResponse = await fetch('/api/notes/create/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        title: 'Shopping List',
        content: 'Milk, eggs, bread'
    })
});
const newNote = await createResponse.json();
console.log('Created note ID:', newNote.id);

// 2. Read all notes
const readResponse = await fetch('/api/notes/');
const allNotes = await readResponse.json();
console.log('All notes:', allNotes);

// 3. Update the note
const updateResponse = await fetch(`/api/notes/${newNote.id}/update/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        content: 'Milk, eggs, bread, butter'
    })
});
const updatedNote = await updateResponse.json();
console.log('Updated note:', updatedNote);

// 4. Delete the note
const deleteResponse = await fetch(`/api/notes/${newNote.id}/delete/`, {
    method: 'DELETE'
});
const deleteResult = await deleteResponse.json();
console.log('Delete result:', deleteResult);
```

### Example 2: Using with Python

```python
import requests
import json

BASE_URL = 'http://localhost:8000/api'

# Create
response = requests.post(f'{BASE_URL}/notes/create/', json={
    'title': 'Python Test',
    'content': 'Testing API with Python'
})
note = response.json()
note_id = note['id']

# Read all
response = requests.get(f'{BASE_URL}/notes/')
all_notes = response.json()
print(f'Total notes: {len(all_notes)}')

# Read one
response = requests.get(f'{BASE_URL}/notes/{note_id}/')
single_note = response.json()
print(f'Note: {single_note["title"]}')

# Update
response = requests.post(f'{BASE_URL}/notes/{note_id}/update/', json={
    'title': 'Updated Python Test'
})

# Delete
response = requests.delete(f'{BASE_URL}/notes/{note_id}/delete/')
print(response.json()['message'])
```

### Example 3: Search/Filter (Future Enhancement)

```javascript
// Future: Implement search filtering
// GET /api/notes/?search=term
// GET /api/notes/?tag=python
// GET /api/notes/?sort=created_at
```

---

## Testing the API

### Using curl
```bash
# Get all notes
curl http://localhost:8000/api/notes/

# Get single note
curl http://localhost:8000/api/notes/1/

# Create note
curl -X POST http://localhost:8000/api/notes/create/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Content"}'

# Update note
curl -X POST http://localhost:8000/api/notes/1/update/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Delete note
curl -X DELETE http://localhost:8000/api/notes/1/delete/
```

### Using Postman

1. Create a new request collection "Notes App"
2. For each endpoint, set:
   - Method: GET/POST/DELETE
   - URL: http://localhost:8000/api/...
   - Headers: Content-Type: application/json
   - Body (for POST): {"title": "...", "content": "..."}
3. Save and test each request

### Using Browser Console

```javascript
// Open browser console (F12), then:

// Get all notes
fetch('/api/notes/').then(r => r.json()).then(d => console.log(d))

// Create note
fetch('/api/notes/create/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({title: 'Test', content: 'Content'})
}).then(r => r.json()).then(d => console.log(d))
```

---

## Best Practices

1. **Error Handling**: Always check `response.ok` or `data.success`
2. **Validation**: Validate input before sending to API
3. **Timestamps**: Use ISO 8601 format for dates
4. **Rate Limiting**: Implement client-side debouncing
5. **CORS**: Configure CORS headers for cross-origin requests
6. **Caching**: Cache notes locally to reduce API calls
7. **Versioning**: Use URL versioning (`/api/v1/notes/`)

---

## Future Enhancements

Planned features:

- [ ] Authentication (JWT tokens)
- [ ] Pagination (`?page=1&limit=10`)
- [ ] Filtering (`?tag=python&status=active`)
- [ ] Sorting (`?sort=-created_at`)
- [ ] Search (`?search=keyword`)
- [ ] Rate limiting
- [ ] Webhooks
- [ ] GraphQL endpoint
- [ ] CORS configuration
- [ ] API versioning

---

## Support

For issues or questions:
- Check TROUBLESHOOTING.md
- Review Django docs: https://docs.djangoproject.com/
- Test endpoints with curl or Postman first

---

**API Version: 1.0**  
**Last Updated: May 2026**  
**Django Version: 5.2.7**

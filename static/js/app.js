// Notes App - Main Application Logic

class NotesApp {
    constructor() {
        this.currentNoteId = null;
        this.notes = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadNotes();
    }

    cacheElements() {
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.notesGrid = document.getElementById('notesGrid');
        this.editorSection = document.getElementById('editorSection');
        this.notesListSection = document.querySelector('.notes-list-section');
        this.noteTitleInput = document.getElementById('noteTitleInput');
        this.noteContentInput = document.getElementById('noteContentInput');
        this.saveBtn = document.getElementById('saveBtn');
        this.deleteBtn = document.getElementById('deleteBtn');
        this.backBtn = document.getElementById('backBtn');
        this.confirmModal = document.getElementById('confirmModal');
        this.modalMessage = document.getElementById('modalMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.editorInfo = document.getElementById('editorInfo');
    }

    attachEventListeners() {
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.saveBtn.addEventListener('click', () => this.saveNote());
        this.deleteBtn.addEventListener('click', () => this.showDeleteConfirm());
        this.backBtn.addEventListener('click', () => this.backToList());
        this.confirmBtn.addEventListener('click', () => this.confirmDelete());
        this.cancelBtn.addEventListener('click', () => this.closeModal());

        // Auto-save on input with debounce
        let saveTimeout;
        this.noteTitleInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.autoSave(), 1000);
        });

        this.noteContentInput.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => this.autoSave(), 1000);
        });
    }

    // Load all notes from server
    async loadNotes() {
        try {
            const response = await fetch('/api/notes/');
            const data = await response.json();
            this.notes = data;
            this.renderNotes();
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showError('Failed to load notes');
        }
    }

    // Render notes to the grid
    renderNotes() {
        this.notesGrid.innerHTML = '';

        if (this.notes.length === 0) {
            this.notesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h2>📭 No Notes Yet</h2>
                    <p>Click "New Note" to create your first note</p>
                </div>
            `;
            return;
        }

        this.notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            this.notesGrid.appendChild(noteCard);
        });
    }

    // Create a note card element
    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.dataset.noteId = note.id;

        const date = new Date(note.updated_at);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        card.innerHTML = `
            <h3>${this.escapeHtml(note.title)}</h3>
            <p>${this.escapeHtml(note.content)}</p>
            <div class="date">${formattedDate}</div>
        `;

        card.addEventListener('click', () => this.editNote(note.id));
        return card;
    }

    // Create a new note
    async createNewNote() {
        try {
            const response = await fetch('/api/notes/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Untitled Note',
                    content: ''
                })
            });

            const data = await response.json();
            if (data.success) {
                this.currentNoteId = data.id;
                this.notes.push(data);
                this.editNote(data.id);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            this.showError('Failed to create note');
        }
    }

    // Edit an existing note
    async editNote(noteId) {
        try {
            const response = await fetch(`/api/notes/${noteId}/`);
            const note = await response.json();

            this.currentNoteId = note.id;
            this.noteTitleInput.value = note.title;
            this.noteContentInput.value = note.content;

            const date = new Date(note.updated_at);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            this.editorInfo.textContent = `Last updated: ${formattedDate}`;

            this.showEditor();
        } catch (error) {
            console.error('Error loading note:', error);
            this.showError('Failed to load note');
        }
    }

    // Auto-save note
    async autoSave() {
        if (!this.currentNoteId) return;

        try {
            const response = await fetch(`/api/notes/${this.currentNoteId}/update/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.noteTitleInput.value || 'Untitled Note',
                    content: this.noteContentInput.value
                })
            });

            const data = await response.json();
            if (data.success) {
                const date = new Date(data.updated_at);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                this.editorInfo.textContent = `💾 Last updated: ${formattedDate}`;

                // Update the note in the local array
                const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
                if (noteIndex !== -1) {
                    this.notes[noteIndex] = data;
                }
            }
        } catch (error) {
            console.error('Error auto-saving note:', error);
        }
    }

    // Manually save note
    async saveNote() {
        await this.autoSave();
        this.showSuccess('Note saved successfully!');
    }

    // Show delete confirmation modal
    showDeleteConfirm() {
        this.modalMessage.textContent = 'Are you sure you want to delete this note? This action cannot be undone.';
        this.confirmModal.classList.add('show');
    }

    // Confirm and delete note
    async confirmDelete() {
        try {
            const response = await fetch(`/api/notes/${this.currentNoteId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (data.success) {
                this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
                this.backToList();
                this.showSuccess('Note deleted successfully!');
                this.renderNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            this.showError('Failed to delete note');
        } finally {
            this.closeModal();
        }
    }

    // Close modal
    closeModal() {
        this.confirmModal.classList.remove('show');
    }

    // Show editor section
    showEditor() {
        this.notesListSection.style.display = 'none';
        this.editorSection.style.display = 'block';
        this.noteTitleInput.focus();
    }

    // Back to notes list
    backToList() {
        this.notesListSection.style.display = 'block';
        this.editorSection.style.display = 'none';
        this.currentNoteId = null;
        this.renderNotes();
    }

    // Utility: Escape HTML characters
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Show success message (toast notification)
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Generic notification toast
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
});

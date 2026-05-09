# 🔧 Troubleshooting Guide

## Installation Issues

### Problem: `pip install` fails
**Error**: `ERROR: Could not find a version that satisfies the requirement`

**Solutions**:
1. Update pip first:
   ```bash
   python -m pip install --upgrade pip
   ```

2. Install packages one by one:
   ```bash
   pip install Django==5.2.7
   pip install mysqlclient==2.2.8
   ```

3. Check Python version (3.8+):
   ```bash
   python --version
   ```

---

### Problem: `ModuleNotFoundError: No module named 'MySQLdb'`
**Error**: `No module named 'MySQLdb'` when running migrations

**Solutions**:
1. Install mysqlclient:
   ```bash
   pip install mysqlclient
   ```

2. If on Mac/Linux and getting compilation errors:
   ```bash
   pip install mysqlclient==2.1.1  # Try older version
   ```

3. Alternative: Use PyMySQL (edit settings.py):
   ```bash
   pip install PyMySQL
   ```
   Then in settings.py add at the top:
   ```python
   import pymysql
   pymysql.install_as_MySQLdb()
   ```

---

## Database Connection Issues

### Problem: `Access denied for user 'root'@'localhost'`
**Error**: Connection fails even though credentials are correct

**Solutions**:
1. Verify MySQL is running:
   - Windows: Services > MySQL80 (or your version)
   - Mac: System Preferences > MySQL > Start MySQL Server
   - Linux: `sudo systemctl status mysql`

2. Verify credentials in settings.py:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'notes_db',
           'USER': 'root',
           'PASSWORD': '',  # Your password here
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```

3. Test MySQL connection directly:
   ```bash
   mysql -u root -p
   ```

4. Recreate user:
   ```sql
   DROP USER 'root'@'localhost';
   CREATE USER 'root'@'localhost' IDENTIFIED BY '';
   GRANT ALL PRIVILEGES ON notes_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Problem: `Unknown database 'notes_db'`
**Error**: The database doesn't exist

**Solutions**:
1. Create the database:
   ```sql
   CREATE DATABASE notes_db;
   ```

2. Verify it was created:
   ```sql
   SHOW DATABASES;
   ```

3. Use the database:
   ```sql
   USE notes_db;
   ```

---

## Migration Issues

### Problem: `No migrations to apply`
**Error**: `No migrations to apply` even though models exist

**Solutions**:
1. Make migrations explicitly:
   ```bash
   cd notesapp
   python manage.py makemigrations notes
   python manage.py migrate
   ```

2. Check if migrations folder exists:
   ```
   notes/migrations/__init__.py  (should exist)
   notes/migrations/0001_initial.py  (should exist)
   ```

3. If migrations are corrupt, reset:
   ```bash
   # Delete all migrations EXCEPT __init__.py
   # Then:
   python manage.py makemigrations
   python manage.py migrate --fake-initial
   ```

---

### Problem: `Syntax error in migration file`
**Error**: `SyntaxError` when running migrations

**Solutions**:
1. Check migration file syntax:
   ```bash
   python -m py_compile notes/migrations/0001_initial.py
   ```

2. Recreate migrations:
   ```bash
   rm notes/migrations/000*.py  (except __init__.py)
   python manage.py makemigrations
   python manage.py migrate
   ```

---

## Server Issues

### Problem: `Port 8000 already in use`
**Error**: `Error: That port is already in use`

**Solutions**:
1. Use a different port:
   ```bash
   python manage.py runserver 8001
   ```

2. Kill process using port 8000 (Windows):
   ```bash
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

3. Kill process using port 8000 (Mac/Linux):
   ```bash
   lsof -ti:8000 | xargs kill -9
   ```

---

### Problem: Server runs but page shows error
**Error**: `Internal Server Error (500)` or blank page

**Solutions**:
1. Check Django logs in terminal output
2. Enable debugging:
   ```python
   # settings.py
   DEBUG = True
   ALLOWED_HOSTS = ['*']
   ```

3. Check static files:
   ```bash
   python manage.py collectstatic --noinput
   ```

---

## Frontend Issues

### Problem: Static files (CSS/JS) not loading
**Error**: Page loads but no styling or interactivity

**Solutions**:
1. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```

2. Check STATIC_URL in settings.py:
   ```python
   STATIC_URL = 'static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'
   ```

3. Verify file paths with browser DevTools (F12):
   - Check Network tab
   - Look for 404 errors on CSS/JS files

4. If still not working, use debug mode:
   ```python
   # settings.py
   DEBUG = True
   ```

---

### Problem: Notes not displaying
**Error**: Empty grid, no notes shown

**Solutions**:
1. Check browser console (F12 > Console tab) for errors
2. Verify API is working:
   - Go to `http://localhost:8000/api/notes/`
   - Should show JSON array
3. Check if database has data:
   ```bash
   python manage.py shell
   >>> from notes.models import Note
   >>> Note.objects.all()
   ```

4. Try creating a note manually in admin:
   - Go to `http://localhost:8000/admin/`
   - Login with superuser
   - Add a note

---

### Problem: Delete button doesn't work
**Error**: Nothing happens when clicking delete

**Solutions**:
1. Check browser console for JavaScript errors (F12)
2. Verify CSRF token in HTML:
   - Right-click > View Page Source
   - Look for `<form>` tags or CSRF handling
3. Check Django CSRF settings in settings.py:
   ```python
   MIDDLEWARE = [
       # ...
       'django.middleware.csrf.CsrfViewMiddleware',
   ]
   ```

---

### Problem: Auto-save not working
**Error**: Changes are not saved, or 404 errors in console

**Solutions**:
1. Open browser console (F12) and check errors
2. Verify update endpoint is correct in app.js
3. Check that note has an ID
4. Verify CSRF protection is not blocking requests

---

## Admin Panel Issues

### Problem: Can't login to admin
**Error**: `Invalid username or password` error

**Solutions**:
1. Check if superuser was created:
   ```bash
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> User.objects.all()
   ```

2. Create superuser if needed:
   ```bash
   python manage.py createsuperuser
   ```

3. Reset superuser password:
   ```bash
   python manage.py changepassword admin  (or username)
   ```

---

### Problem: Admin page shows no notes
**Error**: Notes app doesn't appear in admin

**Solutions**:
1. Check that 'notes' is in INSTALLED_APPS:
   ```python
   INSTALLED_APPS = [
       # ...
       'notes',
   ]
   ```

2. Verify admin.py has Note registered:
   ```python
   from django.contrib import admin
   from .models import Note
   admin.site.register(Note)
   ```

3. Restart server:
   ```bash
   # Kill server (Ctrl+C)
   # Run again:
   python manage.py runserver
   ```

---

## Common Error Messages

### `OperationalError: unable to open database file`
**Cause**: SQLite database was used instead of MySQL

**Fix**: Ensure settings.py has MySQL configuration, not SQLite

---

### `Table 'notes_db.notes_note' doesn't exist`
**Cause**: Migrations were not applied

**Fix**: 
```bash
python manage.py migrate
```

---

### `TemplateDoesNotExist at /`
**Cause**: Template file not found

**Fix**:
1. Check file exists: `templates/notes/index.html`
2. Verify TEMPLATES setting includes correct DIRS
3. Verify app is in INSTALLED_APPS

---

### `ModuleNotFoundError: No module named 'notes'`
**Cause**: Notes app not in INSTALLED_APPS

**Fix**: Add `'notes'` to INSTALLED_APPS in settings.py

---

## Getting Help

### Check These First:
1. **Browser Console** (F12) - JavaScript errors
2. **Terminal Output** - Django error messages
3. **Network Tab** (F12) - Failed API requests
4. **Django Shell** - Database queries
5. **Admin Panel** - Data integrity

### Enable Debug Logging:
```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### Useful Commands:
```bash
# Python shell for testing
python manage.py shell

# Check project configuration
python manage.py check

# View all URLs
python manage.py show_urls

# Create superuser
python manage.py createsuperuser

# Run specific migrations
python manage.py migrate notes 0001

# Reset migrations
python manage.py migrate notes zero

# Clear database
python manage.py flush  # Warning: deletes all data
```

---

## Still Having Issues?

1. **Read Django Documentation**: https://docs.djangoproject.com/
2. **Check MySQL Docs**: https://dev.mysql.com/doc/
3. **Search Stack Overflow**: Search your exact error message
4. **Check Browser DevTools**: F12 to see detailed errors

---

Remember: Most issues are solved by:
1. Restarting the server
2. Running migrations
3. Checking for typos in settings
4. Verifying files exist in correct locations

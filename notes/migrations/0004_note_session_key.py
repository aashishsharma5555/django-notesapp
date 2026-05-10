from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0003_remove_note_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='session_key',
            field=models.CharField(blank=True, db_index=True, max_length=40, null=True),
        ),
    ]

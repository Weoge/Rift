from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chats', '0002_messege_message_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserKeys',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('private_key', models.TextField()),
                ('public_key', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='crypto_keys', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'User Keys',
                'verbose_name_plural': 'User Keys',
            },
        ),
        migrations.CreateModel(
            name='ChatKeys',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symmetric_key', models.TextField()),
                ('symmetric_key_second', models.TextField()),
                ('salt', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('chat', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='crypto_keys', to='chats.chat')),
            ],
            options={
                'verbose_name': 'Chat Keys',
                'verbose_name_plural': 'Chat Keys',
            },
        ),
    ]

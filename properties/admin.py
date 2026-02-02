from django.contrib import admin
from . import models

@admin.register(models.BlockedUsers)
class BlockedUsersAdmin(admin.ModelAdmin):
    list_display = ('blocker', 'blocked_count')
    
    def blocked_count(self, obj):
        return obj.blocked.count()
    blocked_count.short_description = 'Blocked Users'
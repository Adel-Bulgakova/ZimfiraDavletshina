# -*- coding: utf-8 -*-
from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Category, CategoryData


class CategoryDataInline(admin.TabularInline):
    model = CategoryData
    fields = ('category_item_file', 'category_item', 'file_size', 'is_video', 'video_link', 'category_item_name', 'is_published')
    readonly_fields = ('category_item_file', 'file_size')
    extra = 3


class CategoryAdmin(MPTTModelAdmin):
    fields = (
        'thumbnail_file', 'thumbnail', 'slug', 'title', 'subtitle', 'keywords', 'parent', 'created_date', 'published_date', 'is_published')
    readonly_fields = ('thumbnail_file',)
    inlines = [CategoryDataInline]
    # list_display = ('thumbnail_file', 'slug', 'title', 'published_date', 'is_published')
    list_display = ('slug', 'title', 'published_date', 'is_published')

admin.site.register(Category, CategoryAdmin)
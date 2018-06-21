# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random, string, math
import mptt
from mptt.models import MPTTModel, TreeForeignKey
from django.db import models
from django.utils import timezone
from django.core.urlresolvers import reverse


def update_thumbnail_name(instance, filename):
    path = "portfolio/thumbnail/"
    random_name = ''.join(random.choice(string.ascii_letters + string.digits) for n in range(12))
    name, ext = os.path.splitext(filename)
    full_file_name = random_name + ext
    return os.path.join(path, full_file_name)


class CategoryManager(models.Manager):
    def published(self, **kwargs):
        return self.filter(is_published=True, **kwargs).order_by('-created_date')


class Category(MPTTModel):
    thumbnail = models.FileField(
        u"Category thumbnail",
        upload_to=update_thumbnail_name
    )

    title = models.CharField(
        max_length=200,
        help_text="Short descriptive name for this category.",
    )

    subtitle = models.TextField(
        blank=True,
        null=True,
        default="",
        help_text="Some titles may be the same and cause confusion in admin "
                  "UI. A subtitle makes a distinction.",
    )

    slug = models.SlugField(
        max_length=255,
        db_index=True,
        unique=True,
        help_text="Short descriptive unique name for use in urls.",
    )

    keywords = models.TextField(
        blank=True,
        null=True,
        default="",
    )

    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)

    created_date = models.DateField(default=timezone.now)
    published_date = models.DateField(default=timezone.now)
    is_published = models.BooleanField(default=True)

    objects = CategoryManager()

    def __unicode__(self):
        return self.title

    class Meta:
        # ordering = ("slug",)
        verbose_name = "category"
        verbose_name_plural = "categories"
        unique_together = ('slug', 'parent')

    class MPTTMeta:
        level_attr = "mptt_level"
        # order_insertion_by = ["created_date"]

    def get_absolute_url(self):
        return reverse('portfolio', kwargs={'path': self.get_path()})

    def thumbnail_file(self):
        if self.thumbnail:
            thumbnail = self.thumbnail.url
        else:
            thumbnail = 'http://zimfiradavletshina.ru/static/images/default-thumbnail.jpg'
        image_path = '<div style="width:150px; height:100px; background:url(%s); background-size:cover; background-position:center; background-repeat:no-repeat;"></div>' % (
            thumbnail)
        return image_path

    thumbnail_file.allow_tags = True
    thumbnail_file.short_description = "Current thumbnail"


def update_category_item_name(instance, filename):
    path = "portfolio/"
    random_name = ''.join(random.choice(string.ascii_letters + string.digits) for n in range(12))
    name, ext = os.path.splitext(filename)
    full_file_name = random_name + ext
    return os.path.join(path, full_file_name)


class CategoryDataManager(models.Manager):
    def published(self, **kwargs):
        return self.filter(is_published=True, **kwargs).order_by('-pk')


class CategoryData(models.Model):
    category = models.ForeignKey(Category)
    category_item = models.FileField(u"Category item", upload_to=update_category_item_name)
    category_item_name = models.CharField(u"Category item name", max_length=500, blank=True)
    is_video = models.BooleanField(default=False)
    video_link = models.CharField(u"Link on video", max_length=500, blank=True)
    is_published = models.BooleanField(default=True)

    objects = CategoryDataManager()

    def extension(self):
        name, extension = os.path.splitext(self.category_item.name)
        return extension

    def file_size(self):
        file_size = 0
        if self.category_item:
            file_size = self.category_item.size

        if file_size == 0:
            return "0B"
        size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
        i = int(math.floor(math.log(file_size, 1024)))
        p = math.pow(1024, i)
        s = round(file_size / p, 2)
        return "%s %s" % (s, size_name[i])

    def category_item_file(self):
        image_path = '<div style="width:150px; height:100px; background:url(%s); background-size:cover; background-position:center; background-repeat: no-repeat;"></div>' % (
        self.category_item.url)
        return image_path

    category_item_file.allow_tags = True
    category_item_file.short_description = "Current image"
    file_size.short_description = "Image size"

    class Meta:
        verbose_name = u"Category data"
        verbose_name_plural = u"Category data"


mptt.register(Category)
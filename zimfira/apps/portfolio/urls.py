# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls import url
import mptt_urls
from .models import Category, CategoryData
from . import views

urlpatterns = [
    url(r'^$', views.categories_list, name='categories_list'),
    url(ur'^(?P<path>.*)',
        mptt_urls.view(model=Category, view=views.category_detail, slug_field='slug'), name='portfolio')
]
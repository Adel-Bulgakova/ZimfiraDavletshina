# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, render_to_response, get_object_or_404
from django.template import *
from django.conf import settings
from .models import Category, CategoryData


def categories_list(request):
    categories = Category.objects.published().filter(parent=None)

    return render(request, 'portfolio/categories_list.html', {'categories': categories})


def category_detail(request, path, instance):

    pk = Category.objects.get(slug=instance.slug)
    category_data = CategoryData.objects.published().filter(category=pk)

    item_detail_path = str(settings.DEFAULT_DOMAIN) + '/fullscreen/'

    subcategories_data = instance.get_children() if instance else Category.objects.root_nodes()
    subcategories_data_sorted = sorted(subcategories_data, key=lambda category: category.pk, reverse=True)

    return render(
        request,
        'portfolio/category_detail.html',
        {
            'item_detail_path': item_detail_path,
            'category': instance,
            'category_data': category_data,
            'subcategories_data': subcategories_data_sorted,
        }
    )


def category_item_detail(request, item_pk):
    item_instance = CategoryData.objects.filter(pk=item_pk)
    item_instance = get_object_or_404(item_instance)
    category_instance = Category.objects.published().get(pk=item_instance.category_id)
    category_url = category_instance.get_absolute_url()

    category_data = CategoryData.objects.filter(category=item_instance.category_id, is_published=True)

    instance_index = int
    for idx, val in enumerate(category_data):
        if int(val.id) == int(item_pk):
            instance_index = idx
            break

    instance_link_text = "Zimfira Davletshina. %s" % category_instance.title

    return render(
        request,
        'portfolio/category_item_detail.html',
        {
            'instance': item_instance,
            'category_instance': category_instance,
            'category_url': category_url,
            'gallery_elements': category_data,
            'instance_index': instance_index,
            'instance_link_text': instance_link_text
        }
    )

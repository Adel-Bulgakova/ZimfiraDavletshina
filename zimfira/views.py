from django.shortcuts import render, render_to_response, get_object_or_404

from django.http import HttpResponse
from django.template import RequestContext
import portfolio
from portfolio.models import Category
import urllib2


def index_page(request):
    categories_data = Category.objects.published().filter(parent=None)
    categories = []
    for category in categories_data:
        thumbnail = urllib2.urlopen(category.thumbnail.url)
        # if thumbnail.code == 200:
        #     category.thumbnail_url = category.thumbnail.url
        # else:
        #     category.thumbnail_url = '/static/images/411629c7aa8a995a4580745e5afacaa8.jpeg'

        category.thumbnail_url = category.thumbnail.url
        categories.append(category)

    return render(request, 'index.html', {'categories': categories})


def about_page(request):
    return render(request, 'about.html')


def follow_page(request):
    return render(request, 'follow.html')


def search_page(request):
    return render(request, 'search.html')


def test_page(request):
    return render(request, 'test.html')

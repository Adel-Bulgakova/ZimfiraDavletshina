"""Zimfira URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
# from django.conf.urls import include, url
# from django.contrib import admin
#
# urlpatterns = [
#     url(r'^admin/', include(admin.site.urls)),
# ]

from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
import portfolio, contact
from portfolio.views import category_item_detail
from . import views
from django.utils.functional import curry
from django.views.defaults import *

admin.autodiscover()

handler500 = curry(server_error, template_name='index.html')
handler404 = curry(page_not_found, template_name='index.html')
handler403 = curry(permission_denied, template_name='index.html')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^fullscreen/(?P<item_pk>[-\w]+)/$', view=category_item_detail),
    url(r'^portfolio/', include('portfolio.urls')),
    url(r'^test/', views.test_page, name='test_page'),
    url(r'^about/', views.about_page, name='about_page'),
    url(r'^follow/', views.follow_page, name='follow_page'),
    url(r'^contact/', include('contact.urls')),
    url(r'^search/', views.search_page, name='search_page'),
    url(r'', views.index_page, name='index_page'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT, show_indexes=True)
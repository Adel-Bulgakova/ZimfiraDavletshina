from portfolio.models import Category
from django import template

register = template.Library()


@register.inclusion_tag('portfolio/categories.html')
def get_categories_list():
    categories = Category.objects.published().filter(parent=None)
    return {'categories': categories}

from django.shortcuts import render

from .forms import ProductForm
from .models import Product


# Create your views here.
def index(request):
    products = Product.objects.all()
    context = {
        'products': products
    }
    return render(request, 'crud/index.html', context=context)


def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
    else:
        form = ProductForm()

    context = {
        'form': form
    }

    return render(request, 'crud/index.html', context=context)


def edit_product(request):
    pass


def remove_product(request):
    pass

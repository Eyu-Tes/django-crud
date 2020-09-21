from datetime import datetime
import json

from django.contrib import messages
from django.core.serializers import serialize
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.template.loader import render_to_string

from .forms import ProductForm
from .models import Product


# Create your views here.
def index(request):
    products = Product.objects.all()
    context = {
        'products': products
    }
    return render(request, 'crud/index.html', context=context)


def save_product(request, form):
    form_instance = form.save()
    product_instance = Product.objects.get(id=form_instance.id)
    # translate model instance into a json string
    product_str = serialize('json', [product_instance, ])
    # convert the json string into a Python dictionary
    product = json.loads(product_str)[0]
    # get the date value
    date_added_str = product['fields']['date_added']
    # date is stored in db in a format like: '2020-09-20T16:15:22.787Z'
    dt_format = '%Y-%m-%dT%H:%M:%S.%fZ'
    # convert string to a datetime with the given format
    date_added = datetime.strptime(date_added_str, dt_format)
    # convert datetime to a string of format like this: 'Sep, 2020'
    date_added_clean_str = date_added.strftime("%b, %Y")
    # set cleaned date value
    product['fields']['date_added'] = date_added_clean_str
    messages.success(request, 'Product added successfully!')
    return product


def product_create(request):
    data = dict()
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            data['form_is_valid'] = True
            # call the save_product function
            data['obj'] = save_product(request, form)
            # reset form after successful creation
            form = ProductForm()
    else:
        form = ProductForm()
    context = {'form': form, 'msg': 'create'}
    # render_to_string loads a template like get_template() and calls its render() method immediately.
    data['html_form'] = render_to_string('crud/partial_product_form.html',
                                         context=context,
                                         request=request)
    # return response in json format
    return JsonResponse(data)


def product_update(request, pk):
    product_obj = get_object_or_404(Product, id=pk)
    data = {}
    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product_obj)
        if form.is_valid():
            data['form_is_valid'] = True
            if form.has_changed():
                # call the save_product function
                data['obj'] = save_product(request, form)
                data['form_has_changed'] = True
    else:
        form = ProductForm(instance=product_obj)
    context = {'form': form, 'msg': 'update'}
    data['html_form'] = render_to_string('crud/partial_product_form.html',
                                         context=context,
                                         request=request)
    return JsonResponse(data)


def product_delete(request, pk):
    product_obj = get_object_or_404(Product, id=pk)
    context = {'product': product_obj}
    data = dict()
    # if confirm delete is clicked
    if request.method == "POST":
        data['obj_id'] = product_obj.id
        product_obj.delete()
    else:
        data['html_form'] = render_to_string('crud/partial_product_confirm_delete.html',
                                             context=context,
                                             request=request)
    return JsonResponse(data)

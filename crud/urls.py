from django.urls import path

from .views import index, product_create, product_update, product_delete

app_name = 'crud'

urlpatterns = [
    path('', index, name='home'),
    path('product/create/', product_create, name='product_create'),
    path('product/<int:pk>/update/', product_update, name='product_update'),
    path('product/<int:pk>/delete/', product_delete, name='product_delete')
]

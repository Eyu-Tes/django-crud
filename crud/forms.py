from django import forms

from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['product_code', 'name', 'price', 'quantity', 'category']
        widgets = {
            'product_code': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'name': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'price': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'category': forms.Select(attrs={'class': 'form-control form-control-sm'})
        }

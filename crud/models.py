from django.db import models
from django.utils.translation import ugettext_lazy as _


# Create your models here.
class Product(models.Model):
    # enum
    class Categories(models.TextChoices):
        INDOOR = 'Indoor', _('Indoor')
        OUTDOOR = 'Outdoor', _('Outdoor')

    name = models.CharField(max_length=50)
    date_added = models.DateTimeField(auto_now_add=True)
    product_code = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.IntegerField()
    category = models.CharField(max_length=10,
                                choices=Categories.choices,
                                default=Categories.INDOOR,
                                blank=True, null=True)

    class Meta:
        db_table = 'product'
        ordering = ['id']

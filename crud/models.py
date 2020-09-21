from decimal import Decimal

from django.core.validators import MinValueValidator
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
    product_code = models.CharField(unique=True, max_length=30)
    price = models.DecimalField(max_digits=7, decimal_places=2,
                                validators=[MinValueValidator(Decimal(0))])
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    category = models.CharField(max_length=10,
                                choices=Categories.choices,
                                default=Categories.INDOOR,
                                blank=True, null=True)

    class Meta:
        db_table = 'product'
        ordering = ['id']

    def __str__(self):
        return self.product_code

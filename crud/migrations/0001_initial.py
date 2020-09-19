# Generated by Django 3.0.8 on 2020-09-18 19:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('product_code', models.CharField(max_length=30)),
                ('price', models.DecimalField(decimal_places=2, max_digits=5)),
                ('quantity', models.IntegerField()),
                ('category', models.CharField(choices=[('I', 'Indoor'), ('O', 'Outdoor')], default='I', max_length=1)),
            ],
            options={
                'db_table': 'product',
            },
        ),
    ]
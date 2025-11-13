from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('fertilizer', 'Fertilizer'),
        ('pesticide', 'Pesticide'),
        ('seed', 'Seed'),
        ('tool', 'Tool'),
        ('equipment', 'Equipment'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.FloatField()
    unit = models.CharField(max_length=50)
    description = models.TextField()
    image = models.CharField(max_length=10, default='📦')  # Emoji icon
    stock = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    reviews = models.IntegerField(default=0)
    seller = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.category}"

    class Meta:
        ordering = ['-created_at']

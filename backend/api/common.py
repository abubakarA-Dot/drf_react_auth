from django.db import models

class UserRole(models.TextChoices):
    SUPERUSER = 'SU', 'Superuser'
    MANAGER = 'MG', 'Manager'
    ACCOUNTANT = 'AC', 'Accountant'
    RIDER = 'RD', 'Rider'
    CUSTOMER_SUPPORT = 'CS', 'Customer Support'
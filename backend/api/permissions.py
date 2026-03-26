from django.db import models


class Permission(models.Model):
    can_approve_orders = models.BooleanField(default=False)
    can_view_orders = models.BooleanField(default=False)
    can_cancel_orders = models.BooleanField(default=False)
    can_add_users = models.BooleanField(default=False)
    can_edit_users = models.BooleanField(default=False)
    can_manage_employees = models.BooleanField(default=False)
    can_manage_bills = models.BooleanField(default=False)
    can_add_bills = models.BooleanField(default=False)
    can_edit_bills = models.BooleanField(default=False)
    can_manage_invoices = models.BooleanField(default=False)
    can_add_invoices = models.BooleanField(default=False)
    can_edit_invoices = models.BooleanField(default=False)
    is_customer_support = models.BooleanField(default=False)

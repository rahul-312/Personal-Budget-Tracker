# signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from .models import Transaction, UserProfile

@receiver(post_save, sender=Transaction)
@receiver(post_delete, sender=Transaction)
def update_user_savings(sender, instance, **kwargs):
    user = instance.user
    income = Transaction.objects.filter(user=user, transaction_type='income').aggregate(total=Sum('amount'))['total'] or 0
    expense = Transaction.objects.filter(user=user, transaction_type='expense').aggregate(total=Sum('amount'))['total'] or 0
    savings = income - expense

    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.savings = savings
    profile.save()

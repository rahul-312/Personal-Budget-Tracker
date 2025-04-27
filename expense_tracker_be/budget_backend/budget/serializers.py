# serializers.py
from rest_framework import serializers
from .models import Transaction, UserProfile, MonthlyBudget

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'category', 'date']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'profession', 'savings', 'income', 'image']

class MonthlyBudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBudget
        fields = ['id', 'month', 'budget_amount']

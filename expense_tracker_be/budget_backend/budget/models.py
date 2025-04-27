# models.py
from django.db import models
from django.conf import settings
from django.utils.timezone import now

# ---------- Constants ----------

class TransactionType(models.TextChoices):
    INCOME = "Income", "Income"
    EXPENSE = "Expense", "Expense"

class CategoryType(models.TextChoices):
    FOOD = "Food", "Food"
    TRAVEL = "Travel", "Travel"
    SHOPPING = "Shopping", "Shopping"
    NECESSITIES = "Necessities", "Necessities"
    ENTERTAINMENT = "Entertainment", "Entertainment"
    SALARY = "Salary", "Salary"
    OTHER = "Other", "Other"

class ProfessionType(models.TextChoices):
    EMPLOYEE = "Employee", "Employee"
    BUSINESS = "Business", "Business"
    STUDENT = "Student", "Student"
    OTHER = "Other", "Other"

# ---------- Models ----------

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=20, choices=CategoryType.choices, default=CategoryType.OTHER)
    date = models.DateField(default=now)

    class Meta:
        db_table = 'transaction'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user} - {self.transaction_type} - {self.amount}"


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    profession = models.CharField(max_length=20, choices=ProfessionType.choices, null=True, blank=True)
    savings = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    class Meta:
        db_table = 'user_profile'

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} Profile"


class MonthlyBudget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='monthly_budgets')
    month = models.DateField(help_text="Use the first day of the month, e.g., 2025-04-01")
    budget_amount = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = 'monthly_budget'
        unique_together = ('user', 'month')
        ordering = ['-month']

    def __str__(self):
        return f"{self.user} - {self.month.strftime('%B %Y')}"

from django.urls import path
from .views import (
    TransactionListCreateAPIView,
    TransactionDetailAPIView,
    UserProfileAPIView,
    MonthlyBudgetListCreateAPIView,
    MonthlyBudgetDetailAPIView,
    ExpenseSummaryAPIView,
    FinancialStatsAPIView,
    MonthlyBudgetComparisonAPIView
)

urlpatterns = [
    path('transactions/', TransactionListCreateAPIView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('monthly-budgets/', MonthlyBudgetListCreateAPIView.as_view(), name='monthly-budget-list-create'),
    path('monthly-budgets/<int:pk>/', MonthlyBudgetDetailAPIView.as_view(), name='monthly-budget-detail'),
    path('expenses/summary/', ExpenseSummaryAPIView.as_view(), name='expense-summary'),
    path('stats/', FinancialStatsAPIView.as_view(), name='financial-stats'),
    path('monthly-budget-comparison/', MonthlyBudgetComparisonAPIView.as_view(), name='monthly-budget-comparison'),
]

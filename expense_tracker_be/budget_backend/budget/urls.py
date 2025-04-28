# urls.py
from django.urls import path
from .views import (
    TransactionListCreateAPIView,
    TransactionDetailAPIView,
    UserProfileAPIView,
    MonthlyBudgetListCreateAPIView,
    MonthlyBudgetDetailAPIView,
    MonthlyExpenseSummaryAPIView,
    MonthlyStatsAPIView,
    WeeklyExpenseSummaryAPIView,
    YearlyExpenseSummaryAPIView,
    YearlyStatsAPIView,
    MonthlyBudgetComparisonAPIView
)

urlpatterns = [
    path('transactions/', TransactionListCreateAPIView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailAPIView.as_view(), name='transaction-detail'),
    path('profile/', UserProfileAPIView.as_view(), name='user-profile'),
    path('monthly-budgets/', MonthlyBudgetListCreateAPIView.as_view(), name='monthly-budget-list-create'),
    path('monthly-budgets/<int:pk>/', MonthlyBudgetDetailAPIView.as_view(), name='monthly-budget-detail'),
    path('expenses/summary/monthly/', MonthlyExpenseSummaryAPIView.as_view(), name='monthly-expense-summary'),
    path('stats/monthly/', MonthlyStatsAPIView.as_view(), name='monthly-stats'),
    path('expenses/summary/weekly/', WeeklyExpenseSummaryAPIView.as_view(), name='weekly-expense-summary'),
    path('expenses/summary/yearly/', YearlyExpenseSummaryAPIView.as_view(), name='yearly-expense-summary'),
    path('stats/yearly/', YearlyStatsAPIView.as_view(), name='yearly-stats'),
    path('monthly-budget-comparison/', MonthlyBudgetComparisonAPIView.as_view(), name='monthly-budget-comparison'),
]

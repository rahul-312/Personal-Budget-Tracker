from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Transaction, UserProfile, MonthlyBudget
from .serializers import TransactionSerializer, UserProfileSerializer, MonthlyBudgetSerializer
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils import timezone


class TransactionListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(Transaction, pk=pk, user=user)

    def get(self, request, pk):
        transaction = self.get_object(pk, request.user)
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk):
        transaction = self.get_object(pk, request.user)
        serializer = TransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        transaction = self.get_object(pk, request.user)
        serializer = TransactionSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        transaction = self.get_object(pk, request.user)
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthlyBudgetListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        budgets = MonthlyBudget.objects.filter(user=request.user)
        serializer = MonthlyBudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MonthlyBudgetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonthlyBudgetDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        return get_object_or_404(MonthlyBudget, pk=pk, user=user)

    def get(self, request, pk):
        budget = self.get_object(pk, request.user)
        serializer = MonthlyBudgetSerializer(budget)
        return Response(serializer.data)

    def put(self, request, pk):
        budget = self.get_object(pk, request.user)
        serializer = MonthlyBudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        budget = self.get_object(pk, request.user)
        serializer = MonthlyBudgetSerializer(budget, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget = self.get_object(pk, request.user)
        budget.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExpenseSummaryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'monthly')  # 'weekly', 'monthly', 'yearly'
        today = timezone.now()

        days_map = {
            'weekly': 7,
            'monthly': 30,
            'yearly': 365,
        }

        days = days_map.get(period, 30)
        start_date = today - timedelta(days=days)

        transactions = Transaction.objects.filter(
            user=request.user,
            transaction_type='expense',
            date__gte=start_date
        )

        summary = {}
        for transaction in transactions:
            category = transaction.category
            summary[category] = summary.get(category, 0) + transaction.amount

        return Response({
            "period": period,
            "start_date": start_date.date(),
            "end_date": today.date(),
            "summary": summary
        })


class FinancialStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'monthly')  # 'weekly', 'monthly', 'yearly'
        today = timezone.now()

        days_map = {
            'weekly': 7,
            'monthly': 30,
            'yearly': 365,
        }

        days = days_map.get(period, 30)
        start_date = today - timedelta(days=days)

        transactions = Transaction.objects.filter(user=request.user, date__gte=start_date)

        total_income = sum(t.amount for t in transactions if t.transaction_type == 'income')
        total_expense = sum(t.amount for t in transactions if t.transaction_type == 'expense')
        savings = total_income - total_expense

        return Response({
            "period": period,
            "start_date": start_date.date(),
            "end_date": today.date(),
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": savings
        })

class MonthlyBudgetComparisonAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = timezone.now()
        current_month = today.month
        current_year = today.year

        budget = MonthlyBudget.objects.filter(
            user=request.user,
            month__month=current_month,
            month__year=current_year
        ).first()

        if not budget:
            return Response({"error": "No budget set for this month."}, status=status.HTTP_404_NOT_FOUND)

        start_date = today.replace(day=1)
        transactions = Transaction.objects.filter(
            user=request.user,
            transaction_type='expense',
            date__gte=start_date,
            date__lte=today
        )

        total_expense = sum(t.amount for t in transactions)
        difference = budget.budget_amount - total_expense

        return Response({
            "month": today.strftime('%B %Y'),
            "budgeted_amount": budget.budget_amount,
            "actual_expense": total_expense,
            "difference": difference,
            "status": "Under Budget" if difference <= 0 else "Over Budget"
        })

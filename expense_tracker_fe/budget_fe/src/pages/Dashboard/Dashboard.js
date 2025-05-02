import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import {
  fetchExpenseSummary,
  fetchMonthlyBudgetComparison,
  fetchTransactions,
} from '../../api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [budgetComparison, setBudgetComparison] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const chartRef = useRef();
  const barChartRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const expenseData = await fetchExpenseSummary();
        const budgetData = await fetchMonthlyBudgetComparison();
        const transactions = await fetchTransactions();
        setSummary(expenseData);
        setBudgetComparison(budgetData);
        setRecentTransactions(transactions.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load failed:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (summary?.categories) {
      drawPieChart(summary.categories);
    }
  }, [summary]);

  useEffect(() => {
    if (budgetComparison?.length) {
      drawBarChart(budgetComparison);
    }
  }, [budgetComparison]);

  const drawPieChart = (data) => {
    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.amount);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter().append('g');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.category);
  };

  const drawBarChart = (data) => {
    const width = 400, height = 300, margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Clear previous chart
    d3.select(barChartRef.current).selectAll('*').remove();

    const svg = d3.select(barChartRef.current)
      .attr('width', width)
      .attr('height', height);

    const x0 = d3.scaleBand()
      .domain(data.map(d => d.category))
      .rangeRound([margin.left, width - margin.right])
      .paddingInner(0.1);

    const x1 = d3.scaleBand()
      .domain(['budgeted', 'actual'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.budgeted, d.actual))])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal()
      .domain(['budgeted', 'actual'])
      .range(['#4e79a7', '#f28e2b']);

    const xAxis = g => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0));

    const yAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'));

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    const barGroups = svg.selectAll('g.layer')
      .data(data)
      .enter().append('g')
      .attr('transform', d => `translate(${x0(d.category)},0)`);

    barGroups.selectAll('rect')
      .data(d => ['budgeted', 'actual'].map(key => ({ key, value: d[key] })))
      .enter().append('rect')
      .attr('x', d => x1(d.key))
      .attr('y', d => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', d => y(0) - y(d.value))
      .attr('fill', d => color(d.key));
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {summary && (
        <div className="summary-cards">
          <div>Total Income: ₹{summary.total_income}</div>
          <div>Total Expenses: ₹{summary.total_expense}</div>
          <div>Net Savings: ₹{summary.net_savings}</div>
        </div>
      )}

      <h3>Expense Breakdown</h3>
      <svg ref={chartRef}></svg>

      <h3>Budget vs Actual</h3>
      <svg ref={barChartRef}></svg>

      <h3>Recent Transactions</h3>
      <ul>
        {recentTransactions.map(txn => (
          <li key={txn.id}>
            {txn.date} - {txn.category} - ₹{txn.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

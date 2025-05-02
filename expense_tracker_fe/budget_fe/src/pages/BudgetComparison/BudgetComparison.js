import React, { useEffect, useState, useRef } from 'react';
import { fetchMonthlyBudgetComparison } from '../../api';
import * as d3 from 'd3';
import './BudgetComparison.css';

const BudgetComparison = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  const loadComparison = async () => {
    try {
      const data = await fetchMonthlyBudgetComparison();
      setComparison(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No budget set for this month.");
      } else {
        setError("Something went wrong while fetching budget comparison.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, []);

  useEffect(() => {
    if (comparison) {
      d3.select(chartRef.current).selectAll("*").remove();
  
      const data = [
        { label: "Budgeted", value: comparison.budgeted_amount, color: "#2196f3" },
        { label: "Spent", value: comparison.actual_expense, color: "#f44336" }
      ];
  
      const width = 400;
      const height = 250;
      const margin = { top: 30, right: 20, bottom: 40, left: 60 };
  
      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
      const x = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.4);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.2])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      // Bars
      svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.label))
        .attr("y", y(0))
        .attr("height", 0)
        .attr("width", x.bandwidth())
        .attr("fill", d => d.color)
        .transition()
        .duration(800)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("rx", 6);  // Rounded corners
  
      // X Axis
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
  
      // Y Axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5));
  
      // Labels above bars
      svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.label) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#333")
        .style("font-size", "14px")
        .text(d => `₹${d.value}`);
    }
  }, [comparison]);

  return (
    <div className="budget-comparison-container">
      <h2>Monthly Budget Comparison</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <div className={`comparison-card ${comparison.status === 'Over Budget' ? 'over' : 'under'}`}>
            <p><strong>Month:</strong> {comparison.month}</p>
            <p><strong>Budgeted:</strong> ₹{comparison.budgeted_amount}</p>
            <p><strong>Spent:</strong> ₹{comparison.actual_expense}</p>
            <p><strong>Difference:</strong> ₹{comparison.difference}</p>
            <p><strong>Status:</strong> <span className="status">{comparison.status}</span></p>
          </div>
          <div ref={chartRef} className="chart-container"></div>
        </>
      )}
    </div>
  );
};

export default BudgetComparison;

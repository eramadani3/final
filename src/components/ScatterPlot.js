import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlot = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const margin = { top: 20, right: 30, bottom: 60, left: 70 }, 
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

      d3.select(d3Container.current).selectAll("*").remove();

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const svg = d3.select(d3Container.current)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear()
                  .domain([0, 1])
                  .range([0, width]);
      svg.append("g")
         .attr("transform", `translate(0,${height})`)
         .call(d3.axisBottom(x));

      const y = d3.scaleLinear()
                  .domain([0, 1])
                  .range([height, 0]);
      svg.append("g")
         .call(d3.axisLeft(y));

      svg.append("text")
         .attr("text-anchor", "end")
         .attr("x", width/2 + margin.left)
         .attr("y", height + margin.top + 20)
         .text("Field Goal Percentage (FG_PCT)");

      svg.append("text")
         .attr("text-anchor", "end")
         .attr("transform", "rotate(-90)")
         .attr("y", -margin.left + 20)
         .attr("x", -height/2)
         .text("Win Percentage (W_PCT)");

      svg.selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", function (d) { return x(d.FG_PCT); })
          .attr("cy", function (d) { return y(d.W_PCT); })
          .attr("r", 5)
          .style("fill", function(d, i) { return colorScale(i); });

      // Add labels to each dot
      svg.selectAll(".label")
         .data(data)
         .enter()
         .append("text")
         .attr("class", "label")
         .attr("x", d => x(d.FG_PCT) + 10) 
         .attr("y", d => y(d.W_PCT))
         .text(d => d.TEAM_NAME)
         .attr("text-anchor", "start")
         .attr("alignment-baseline", "middle")
         .style("font-size", "10px")
         .style("fill", "#555");
    }
  }, [data]);

  return (
    <div>
      <h2>NBA Team Stats Scatter Plot</h2>
      <div ref={d3Container} />
    </div>
  );
};

export default ScatterPlot;

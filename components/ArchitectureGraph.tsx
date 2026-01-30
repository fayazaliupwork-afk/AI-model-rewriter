
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SystemNode, SystemLink } from '../types';

interface Props {
  nodes: SystemNode[];
  links: SystemLink[];
}

const ArchitectureGraph: React.FC<Props> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => (d as any).latency > 500 ? 3 : 1)
      .attr("stroke-dasharray", d => (d as any).type === 'async' ? "5,5" : "0");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("rect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("x", -50)
      .attr("y", -20)
      .attr("rx", 6)
      .attr("fill", d => {
        switch (d.status) {
          case 'healthy': return '#065f46';
          case 'bottleneck': return '#991b1b';
          case 'legacy': return '#1e3a8a';
          case 'unoptimized': return '#854d0e';
          default: return '#374151';
        }
      })
      .attr("stroke", "#9ca3af")
      .attr("stroke-width", 1);

    node.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "10px")
      .text(d => d.label);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, links]);

  return (
    <div className="w-full bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-4 text-xs">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-800"></span> Healthy</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-800"></span> Bottleneck</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-800"></span> Legacy</div>
      </div>
      <svg ref={svgRef} className="w-full h-[400px]" />
    </div>
  );
};

export default ArchitectureGraph;

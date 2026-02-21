import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GlassCard } from '../UI';

interface KanjiNode {
  name: string;
  children?: KanjiNode[];
  learned?: boolean;
}

const mockKanjiData: KanjiNode = {
  name: "日",
  learned: true,
  children: [
    { name: "明", learned: true, children: [{ name: "明日", learned: true }] },
    { name: "曜", learned: true, children: [{ name: "日曜日", learned: false }] },
    { name: "時", learned: true, children: [{ name: "時間", learned: true }] },
    { name: "間", learned: false, children: [{ name: "人間", learned: false }] },
  ]
};

export const KnowledgeMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const radius = width / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${radius},${radius})`);

    const tree = d3.tree<KanjiNode>()
      .size([2 * Math.PI, radius - 40]);

    const root = d3.hierarchy(mockKanjiData);
    tree(root);

    // Links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y) as any)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5);

    // Nodes
    const node = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `
        rotate(${(d.x * 180 / Math.PI - 90)})
        translate(${d.y},0)
      `);

    node.append("circle")
      .attr("r", 15)
      .attr("fill", d => d.data.learned ? "#10b981" : "#f3f4f6")
      .attr("stroke", d => d.data.learned ? "#059669" : "#d1d5db")
      .attr("stroke-width", 2);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 20 : -20)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#1f2937");

  }, []);

  return (
    <GlassCard className="h-full flex flex-col items-center">
      <h3 className="text-lg font-bold mb-4 self-start">Knowledge Map (Kanji Tree)</h3>
      <div className="flex-1 flex items-center justify-center w-full">
        <svg ref={svgRef}></svg>
      </div>
      <p className="text-xs text-bamboo mt-2">Kanji and their radicals/compounds</p>
    </GlassCard>
  );
};

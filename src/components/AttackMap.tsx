import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AttackMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 450;

    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Load world map data
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data: any) => {
      svg.append('g')
        .selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#1a233a')
        .attr('stroke', '#00ffcc')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.5);

      // Simulate attacks
      const simulateAttack = () => {
        const source = data.features[Math.floor(Math.random() * data.features.length)];
        const target = data.features[Math.floor(Math.random() * data.features.length)];

        if (!source || !target) return;

        const sourceCoords = d3.geoCentroid(source);
        const targetCoords = d3.geoCentroid(target);

        const [x1, y1] = projection(sourceCoords) || [0, 0];
        const [x2, y2] = projection(targetCoords) || [0, 0];

        const line = svg.append('path')
          .attr('d', `M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 - 50} ${x2},${y2}`)
          .attr('fill', 'none')
          .attr('stroke', '#ff0055')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '1000')
          .attr('stroke-dashoffset', '1000');

        line.transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            svg.append('circle')
              .attr('cx', x2)
              .attr('cy', y2)
              .attr('r', 0)
              .attr('fill', '#ff0055')
              .attr('opacity', 0.8)
              .transition()
              .duration(500)
              .attr('r', 10)
              .attr('opacity', 0)
              .remove();
            
            line.transition()
              .duration(500)
              .attr('opacity', 0)
              .remove();
          });
      };

      const interval = setInterval(simulateAttack, 3000);
      return () => clearInterval(interval);
    });
  }, []);

  return (
    <div className="glass-card p-4 relative overflow-hidden h-[500px] flex items-center justify-center">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-cyber-neon font-bold uppercase tracking-widest text-sm">Live Threat Map</h3>
        <p className="text-white/50 text-xs">Real-time global attack vectors</p>
      </div>
      <svg ref={svgRef} viewBox="0 0 800 450" className="w-full h-full" />
      <div className="scan-line" />
    </div>
  );
};

export default AttackMap;

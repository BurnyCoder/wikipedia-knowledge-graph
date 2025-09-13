// Load and visualize the graph data
d3.json('graph-data.json').then(function(data) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Update stats
    document.getElementById('stats').innerHTML = `
        Nodes: ${data.nodes.length}<br>
        Edges: ${data.links.length}
    `;
    
    // Create SVG
    const svg = d3.select('#graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', function(event) {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Create main group for zooming
    const g = svg.append('g');
    
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links)
            .id(d => d.id)
            .distance(100))
        .force('charge', d3.forceManyBody()
            .strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide()
            .radius(d => d.size + 5));
    
    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .style('stroke', '#666')
        .style('stroke-opacity', 0.6)
        .style('stroke-width', 1);
    
    // Create nodes
    const node = g.append('g')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.size)
        .style('fill', d => d.isPrimary ? '#ff6b6b' : '#4fc3f7')
        .style('stroke', '#fff')
        .style('stroke-width', 2)
        .style('cursor', 'pointer')
        .call(drag(simulation));
    
    // Add labels for all nodes
    const labels = g.append('g')
        .selectAll('text')
        .data(data.nodes)
        .enter()
        .append('text')
        .text(d => d.label)
        .style('font-size', d => d.isPrimary ? '14px' : '10px')
        .style('font-weight', d => d.isPrimary ? 'bold' : 'normal')
        .style('fill', '#fff')
        .style('text-anchor', 'middle')
        .style('pointer-events', 'none')
        .style('text-shadow', '0 0 3px #000');
    
    // Tooltip
    const tooltip = d3.select('#tooltip');
    
    node.on('mouseover', function(event, d) {
        tooltip
            .style('display', 'block')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .html(`<strong>${d.label}</strong><br>Type: ${d.isPrimary ? 'Primary Node' : 'Connected Page'}`);
        
        // Highlight connected edges
        link.style('stroke-opacity', l => 
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
        );
        
        // Dim non-connected nodes
        node.style('opacity', n => {
            if (n.id === d.id) return 1;
            const connected = data.links.some(l => 
                (l.source.id === d.id && l.target.id === n.id) ||
                (l.target.id === d.id && l.source.id === n.id)
            );
            return connected ? 1 : 0.3;
        });
    });
    
    node.on('mouseout', function() {
        tooltip.style('display', 'none');
        link.style('stroke-opacity', 0.6);
        node.style('opacity', 1);
    });
    
    // Double click to open Wikipedia page
    node.on('dblclick', function(event, d) {
        window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(d.id)}`, '_blank');
    });
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        labels
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5);
    });
    
    // Drag behavior
    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    location.reload();
});
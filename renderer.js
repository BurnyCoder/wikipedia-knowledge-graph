const WikipediaAPI = require('./wikipedia-api');
const GraphBuilder = require('./graph-builder');

const PRIMARY_PAGES = [
    "Science",
    "Natural science",
    "Formal science",
    "Mathematics",
    "Physics",
    "Artificial intelligence"
];

let simulation;
let svg;
let g;
let link;
let node;
let nodeLabel;
let showLabels = true;
let graphData = null;

// Initialize D3 graph
function initGraph() {
    const width = document.getElementById('graph-container').offsetWidth;
    const height = document.getElementById('graph-container').offsetHeight;

    svg = d3.select('#graph')
        .attr('width', width)
        .attr('height', height);

    // Clear existing content
    svg.selectAll("*").remove();

    // Add container group for zoom
    g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    return { width, height, tooltip };
}

function createSimulation(width, height, linkDistance = 150) {
    return d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id).distance(linkDistance))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(30));
}

function updateGraph(data) {
    if (!data || !data.nodes || !data.links) return;

    const { width, height, tooltip } = initGraph();

    const nodeSize = parseInt(document.getElementById('nodeSize').value);
    const linkDistance = parseInt(document.getElementById('linkDistance').value);

    // Create simulation
    simulation = createSimulation(width, height, linkDistance);

    // Create links
    link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1);

    // Create nodes
    node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
        .attr('r', d => d.isPrimary ? nodeSize * 2 : nodeSize)
        .attr('fill', d => d.isPrimary ? '#ff6b6b' : '#4ecdc4')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(d.label)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');

            // Highlight connected nodes
            link.style('stroke-opacity', l =>
                l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
            node.style('opacity', n => {
                if (n.id === d.id) return 1;
                const connected = data.links.some(l =>
                    (l.source.id === d.id && l.target.id === n.id) ||
                    (l.target.id === d.id && l.source.id === n.id)
                );
                return connected ? 1 : 0.3;
            });
        })
        .on('mouseout', function() {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);

            link.style('stroke-opacity', 0.4);
            node.style('opacity', 1);
        })
        .on('click', function(event, d) {
            window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(d.label)}`, '_blank');
        });

    // Add drag behavior
    node.call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Create labels
    nodeLabel = g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(data.nodes)
        .enter().append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', -15)
        .style('font-size', d => d.isPrimary ? '14px' : '10px')
        .style('font-weight', d => d.isPrimary ? 'bold' : 'normal')
        .style('fill', '#333')
        .style('display', showLabels ? 'block' : 'none')
        .text(d => d.label);

    // Update simulation
    simulation
        .nodes(data.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(data.links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        nodeLabel
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }
}

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

// Load data from Wikipedia
async function loadWikipediaData() {
    const loadBtn = document.getElementById('loadDataBtn');
    const status = document.getElementById('status');
    const loading = document.getElementById('loading');
    const linksPerPage = parseInt(document.getElementById('linksPerPage').value);

    loadBtn.disabled = true;
    loading.style.display = 'block';
    status.textContent = 'Fetching Wikipedia data...';

    try {
        const wikiAPI = new WikipediaAPI();
        const wikiData = await wikiAPI.getMultiplePageLinks(PRIMARY_PAGES, linksPerPage);

        status.textContent = 'Building graph...';

        const builder = new GraphBuilder();
        graphData = builder.buildGraphFromWikipediaData(wikiData, PRIMARY_PAGES);

        const stats = builder.getStatistics();
        document.getElementById('nodeCount').textContent = stats.nodeCount;
        document.getElementById('linkCount').textContent = stats.linkCount;

        updateGraph(graphData);

        status.textContent = `Graph loaded: ${stats.nodeCount} nodes, ${stats.linkCount} links`;
    } catch (error) {
        console.error('Error loading data:', error);
        status.textContent = 'Error loading data: ' + error.message;
    } finally {
        loadBtn.disabled = false;
        loading.style.display = 'none';
    }
}

// Event listeners
document.getElementById('loadDataBtn').addEventListener('click', loadWikipediaData);

document.getElementById('resetViewBtn').addEventListener('click', () => {
    if (graphData) {
        updateGraph(graphData);
    }
});

document.getElementById('toggleLabelsBtn').addEventListener('click', () => {
    showLabels = !showLabels;
    if (nodeLabel) {
        nodeLabel.style('display', showLabels ? 'block' : 'none');
    }
});

document.getElementById('nodeSize').addEventListener('input', () => {
    if (graphData) {
        updateGraph(graphData);
    }
});

document.getElementById('linkDistance').addEventListener('input', () => {
    if (graphData) {
        updateGraph(graphData);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (graphData) {
        updateGraph(graphData);
    }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    initGraph();
});
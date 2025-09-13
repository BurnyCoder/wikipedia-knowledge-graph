const WikipediaFetcher = require('./wikipedia-fetcher');
const fs = require('fs');

async function buildKnowledgeGraph() {
    const fetcher = new WikipediaFetcher();
    
    // Primary nodes as specified
    const primaryNodes = [
        'Science',
        'Natural science',
        'Formal science',
        'Mathematics',
        'Physics',
        'Artificial intelligence'
    ];

    console.log('Starting to fetch Wikipedia data...');
    
    // Fetch links for all primary nodes
    const linkData = await fetcher.fetchMultiplePages(primaryNodes);
    
    // Build graph data structure
    const nodes = new Map();
    const edges = [];
    
    // Add primary nodes
    primaryNodes.forEach(node => {
        nodes.set(node, {
            id: node,
            label: node,
            isPrimary: true,
            size: 30
        });
    });
    
    // Process links and create edges
    for (const [source, links] of Object.entries(linkData)) {
        for (const target of links) {
            // Add secondary node if not already present
            if (!nodes.has(target)) {
                nodes.set(target, {
                    id: target,
                    label: target,
                    isPrimary: false,
                    size: 10
                });
            }
            
            // Add edge
            edges.push({
                source: source,
                target: target
            });
        }
    }
    
    // Convert to format suitable for D3.js
    const graphData = {
        nodes: Array.from(nodes.values()),
        links: edges
    };
    
    // Save graph data to JSON file
    fs.writeFileSync('graph-data.json', JSON.stringify(graphData, null, 2));
    console.log(`Graph data saved. Total nodes: ${nodes.size}, Total edges: ${edges.length}`);
    
    return graphData;
}

// Run the builder
if (require.main === module) {
    buildKnowledgeGraph().catch(console.error);
}

module.exports = buildKnowledgeGraph;
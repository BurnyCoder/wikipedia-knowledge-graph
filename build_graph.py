import json
from wikipedia_fetcher import WikipediaFetcher

def build_knowledge_graph():
    """Build knowledge graph from Wikipedia data."""
    fetcher = WikipediaFetcher()
    
    # Primary nodes as specified
    primary_nodes = [
        'Science',
        'Natural science',
        'Formal science',
        'Mathematics',
        'Physics',
        'Artificial intelligence'
    ]
    
    print('Starting to fetch Wikipedia data...')
    
    # Fetch links for all primary nodes
    link_data = fetcher.fetch_multiple_pages(primary_nodes)
    
    # Build graph data structure
    nodes = {}
    edges = []
    
    # Add primary nodes
    for node in primary_nodes:
        nodes[node] = {
            'id': node,
            'label': node,
            'isPrimary': True,
            'size': 30
        }
    
    # Process links and create edges
    for source, links in link_data.items():
        for target in links:
            # Add secondary node if not already present
            if target not in nodes:
                nodes[target] = {
                    'id': target,
                    'label': target,
                    'isPrimary': False,
                    'size': 10
                }
            
            # Add edge
            edges.append({
                'source': source,
                'target': target
            })
    
    # Convert to format suitable for D3.js
    graph_data = {
        'nodes': list(nodes.values()),
        'links': edges
    }
    
    # Save graph data to JSON file
    with open('graph-data.json', 'w') as f:
        json.dump(graph_data, f, indent=2)
    
    print(f'Graph data saved. Total nodes: {len(nodes)}, Total edges: {len(edges)}')
    
    return graph_data

if __name__ == '__main__':
    build_knowledge_graph()
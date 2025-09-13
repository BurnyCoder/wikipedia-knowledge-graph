# Wikipedia Knowledge Graph Visualization

An interactive knowledge graph visualization that connects Wikipedia articles starting from key science and mathematics topics.

## Features

- **Interactive Force-Directed Graph**: Visualizes connections between Wikipedia articles
- **Primary Nodes**: Science, Natural Science, Formal Science, Mathematics, Physics, and Artificial Intelligence
- **Dynamic Exploration**: 
  - Drag nodes to rearrange the graph
  - Zoom in/out for better navigation
  - Hover over nodes to see details
  - Double-click nodes to open Wikipedia articles
- **Visual Distinction**: Primary nodes are highlighted in red, connected pages in blue
- **All Labels Visible**: Every node displays its title for easy identification

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wikipedia-knowledge-graph.git
cd wikipedia-knowledge-graph
```

2. Install dependencies:
```bash
npm install
```

3. Fetch Wikipedia data and build the graph:
```bash
node build-graph.js
```

4. Start the visualization server:
```bash
node server.js
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

- `wikipedia-fetcher.js` - Module for fetching data from Wikipedia API
- `build-graph.js` - Builds the graph data structure from Wikipedia links
- `visualization.js` - D3.js visualization logic
- `server.js` - Express server to host the application
- `index.html` - Main HTML page with styling
- `graph-data.json` - Generated graph data (nodes and edges)

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web server framework
- **D3.js** - Data visualization library
- **Axios** - HTTP client for Wikipedia API requests
- **Wikipedia API** - Data source for article connections

## How It Works

1. The application fetches article links from Wikipedia for each primary node
2. Creates a graph structure with nodes (articles) and edges (links between articles)
3. Visualizes the graph using D3.js force simulation
4. Provides interactive controls for exploring the knowledge connections

## Customization

To add more primary nodes or change the visualization, edit:
- `build-graph.js` - Modify the `primaryNodes` array
- `visualization.js` - Adjust colors, sizes, and physics parameters
- `wikipedia-fetcher.js` - Change the link limit per page

## License

MIT
# Wikipedia Knowledge Graph Visualization

An interactive knowledge graph visualization that connects Wikipedia articles starting from key science and mathematics topics. Available in both **Python** and **Node.js** implementations.

<img width="1884" height="894" alt="image" src="https://github.com/user-attachments/assets/d555f22b-8f57-491b-9460-b872d231a7d3" />

<img width="1099" height="1079" alt="image" src="https://github.com/user-attachments/assets/6faea7e3-7782-44ba-806f-3bfeec58406f" />

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
- **Rebuild Button**: Refresh graph data directly from the web interface (Python version)

## Python Version (Flask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BurnyCoder/wikipedia-knowledge-graph.git
cd wikipedia-knowledge-graph
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Fetch Wikipedia data and build the graph:
```bash
python build_graph.py
```

4. Start the Flask server:
```bash
python app.py
```

5. Open your browser and navigate to:
```
http://localhost:5000
```

### Python Project Structure

- `wikipedia_fetcher.py` - Python module for fetching data from Wikipedia API
- `build_graph.py` - Builds the graph data structure from Wikipedia links
- `app.py` - Flask server with API endpoints
- `templates/index.html` - Main HTML template
- `static/visualization.js` - D3.js visualization logic
- `graph-data.json` - Generated graph data (nodes and edges)
- `requirements.txt` - Python dependencies

## Node.js Version (Express)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BurnyCoder/wikipedia-knowledge-graph.git
cd wikipedia-knowledge-graph
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Fetch Wikipedia data and build the graph:
```bash
node build-graph.js
```

4. Start the Express server:
```bash
node server.js
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

### Node.js Project Structure

- `wikipedia-fetcher.js` - Node.js module for fetching data from Wikipedia API
- `build-graph.js` - Builds the graph data structure from Wikipedia links
- `server.js` - Express server to host the application
- `index.html` - Main HTML page with styling
- `visualization.js` - D3.js visualization logic
- `graph-data.json` - Generated graph data (nodes and edges)
- `package.json` - Node.js dependencies

## Technologies Used

### Python Version
- **Python 3.x** - Programming language
- **Flask** - Web framework
- **Requests** - HTTP client for Wikipedia API
- **D3.js** - Data visualization library

### Node.js Version
- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Axios** - HTTP client for Wikipedia API requests
- **D3.js** - Data visualization library

## API Endpoints (Python Version)

- `GET /` - Main visualization page
- `GET /api/graph-data` - Get current graph data
- `POST /api/rebuild-graph` - Rebuild graph from Wikipedia

## How It Works

1. The application fetches ALL article links from Wikipedia for each primary node
2. Creates a graph structure with nodes (articles) and edges (links between articles)
3. Visualizes the graph using D3.js force simulation
4. Provides interactive controls for exploring the knowledge connections
5. Currently includes ~3,860 nodes and ~4,588 edges

## Customization

To add more primary nodes or change the visualization:

### Python Version
- Edit `build_graph.py` - Modify the `primary_nodes` list
- Edit `static/visualization.js` - Adjust colors, sizes, and physics parameters

### Node.js Version
- Edit `build-graph.js` - Modify the `primaryNodes` array
- Edit `visualization.js` - Adjust colors, sizes, and physics parameters

## License

MIT

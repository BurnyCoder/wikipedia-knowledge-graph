from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

@app.route('/')
def index():
    """Serve the main visualization page."""
    return render_template('index.html')

@app.route('/api/graph-data')
def get_graph_data():
    """API endpoint to get graph data."""
    try:
        with open('graph-data.json', 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Graph data not found. Please run build_graph.py first.'}), 404

@app.route('/api/rebuild-graph', methods=['POST'])
def rebuild_graph():
    """API endpoint to rebuild the graph data."""
    try:
        from build_graph import build_knowledge_graph
        graph_data = build_knowledge_graph()
        return jsonify({
            'success': True,
            'nodes': len(graph_data['nodes']),
            'edges': len(graph_data['links'])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/static/<path:path>')
def send_static(path):
    """Serve static files."""
    return send_from_directory('static', path)

if __name__ == '__main__':
    port = int(os.environ.get('FLASK_RUN_PORT', 5000))
    print(f'Knowledge Graph Visualization running at http://localhost:{port}')
    print('Open this URL in your browser to view the visualization')
    app.run(debug=False, port=port, host='0.0.0.0', use_reloader=False)
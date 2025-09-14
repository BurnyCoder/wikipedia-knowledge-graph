import webview
import threading
import time
import os
import sys
from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import json

# Import the Flask app
from app import app

class DesktopApp:
    def __init__(self):
        self.server_thread = None
        self.window = None
        
    def run_server(self):
        """Run Flask server in background thread."""
        app.run(port=5555, debug=False, use_reloader=False)
    
    def start(self):
        """Start the desktop application."""
        # Start Flask server in a separate thread
        self.server_thread = threading.Thread(target=self.run_server, daemon=True)
        self.server_thread.start()
        
        # Wait a moment for server to start
        time.sleep(1)
        
        # Create webview window
        self.window = webview.create_window(
            'Wikipedia Knowledge Graph Visualization',
            'http://localhost:5555',
            width=1400,
            height=900,
            resizable=True,
            fullscreen=False,
            min_size=(800, 600)
        )
        
        # Start webview
        webview.start()

def main():
    """Main entry point for desktop application."""
    print("Starting Wikipedia Knowledge Graph Desktop Application...")
    print("Please wait while the application loads...")
    
    # Check if graph data exists
    if not os.path.exists('graph-data.json'):
        print("\nGraph data not found. Building graph from Wikipedia...")
        try:
            from build_graph import build_knowledge_graph
            build_knowledge_graph()
            print("Graph data built successfully!")
        except Exception as e:
            print(f"Error building graph: {e}")
            print("Please run 'python build_graph.py' manually first.")
            sys.exit(1)
    
    # Create and start desktop app
    app_instance = DesktopApp()
    app_instance.start()

if __name__ == '__main__':
    main()
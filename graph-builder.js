class GraphBuilder {
    constructor() {
        this.nodes = new Map();
        this.links = [];
    }

    addNode(id, label, isPrimary = false) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, {
                id: id,
                label: label,
                isPrimary: isPrimary,
                group: isPrimary ? 1 : 2
            });
        }
    }

    addLink(source, target) {
        // Only add link if both nodes exist
        if (this.nodes.has(source) && this.nodes.has(target)) {
            this.links.push({
                source: source,
                target: target,
                value: 1
            });
        }
    }

    buildGraphFromWikipediaData(wikiData, primaryPages) {
        // Add primary nodes
        primaryPages.forEach(page => {
            this.addNode(page, page, true);
        });

        // Process links for each primary page
        for (const [sourcePage, links] of Object.entries(wikiData)) {
            // Add all linked pages as nodes
            links.forEach(linkedPage => {
                this.addNode(linkedPage, linkedPage, false);
                this.addLink(sourcePage, linkedPage);
            });
        }

        // Find connections between secondary nodes
        const allNodes = Array.from(this.nodes.keys());
        for (const node1 of allNodes) {
            if (wikiData[node1]) {
                for (const node2 of allNodes) {
                    if (node1 !== node2 && wikiData[node1].includes(node2)) {
                        this.addLink(node1, node2);
                    }
                }
            }
        }

        return this.getGraphData();
    }

    getGraphData() {
        return {
            nodes: Array.from(this.nodes.values()),
            links: this.links
        };
    }

    getStatistics() {
        return {
            nodeCount: this.nodes.size,
            linkCount: this.links.length,
            primaryNodes: Array.from(this.nodes.values()).filter(n => n.isPrimary).length
        };
    }
}

module.exports = GraphBuilder;
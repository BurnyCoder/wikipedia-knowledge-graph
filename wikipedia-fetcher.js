const axios = require('axios');

class WikipediaFetcher {
    constructor() {
        this.baseUrl = 'https://en.wikipedia.org/w/api.php';
        this.linkLimit = 50; // Limit links per page to keep graph manageable
    }

    async fetchPageLinks(pageTitle) {
        try {
            const params = {
                action: 'query',
                format: 'json',
                titles: pageTitle,
                prop: 'links',
                pllimit: this.linkLimit,
                origin: '*'
            };

            const response = await axios.get(this.baseUrl, { params });
            const pages = response.data.query.pages;
            const pageId = Object.keys(pages)[0];
            
            if (pageId === '-1') {
                console.error(`Page not found: ${pageTitle}`);
                return [];
            }

            const links = pages[pageId].links || [];
            return links.map(link => link.title);
        } catch (error) {
            console.error(`Error fetching links for ${pageTitle}:`, error.message);
            return [];
        }
    }

    async fetchMultiplePages(pageTitles) {
        const results = {};
        
        for (const title of pageTitles) {
            console.log(`Fetching links from: ${title}`);
            const links = await this.fetchPageLinks(title);
            results[title] = links;
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return results;
    }
}

module.exports = WikipediaFetcher;
const axios = require('axios');

class WikipediaFetcher {
    constructor() {
        this.baseUrl = 'https://en.wikipedia.org/w/api.php';
    }

    async fetchPageLinks(pageTitle) {
        try {
            let allLinks = [];
            let continueToken = null;
            let iterations = 0;
            
            do {
                const params = {
                    action: 'query',
                    format: 'json',
                    titles: pageTitle,
                    prop: 'links',
                    pllimit: 'max', // Get maximum links per request (500)
                    origin: '*'
                };
                
                if (continueToken) {
                    params.plcontinue = continueToken;
                }

                const response = await axios.get(this.baseUrl, { params });
                const pages = response.data.query.pages;
                const pageId = Object.keys(pages)[0];
                
                if (pageId === '-1') {
                    console.error(`Page not found: ${pageTitle}`);
                    return [];
                }

                const links = pages[pageId].links || [];
                allLinks = allLinks.concat(links.map(link => link.title));
                
                // Check for continuation
                continueToken = response.data.continue ? response.data.continue.plcontinue : null;
                iterations++;
                
                // Small delay to avoid rate limiting
                if (continueToken) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                console.log(`  Fetched batch ${iterations} for ${pageTitle}: ${links.length} links`);
            } while (continueToken);
            
            console.log(`  Total links for ${pageTitle}: ${allLinks.length}`);
            return allLinks;
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
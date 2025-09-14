const axios = require('axios');

const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';
const RATE_LIMIT_DELAY = 100; // ms between requests

class WikipediaAPI {
    constructor() {
        this.cache = new Map();
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getPageLinks(pageTitle) {
        if (this.cache.has(pageTitle)) {
            return this.cache.get(pageTitle);
        }

        try {
            // Get page links
            const response = await axios.get(WIKIPEDIA_API, {
                params: {
                    action: 'query',
                    format: 'json',
                    titles: pageTitle,
                    prop: 'links',
                    pllimit: 'max',
                    origin: '*'
                }
            });

            const pages = response.data.query.pages;
            const pageId = Object.keys(pages)[0];

            if (pageId === '-1') {
                console.error(`Page not found: ${pageTitle}`);
                return [];
            }

            const links = pages[pageId].links || [];
            const linkTitles = links.map(link => link.title);

            this.cache.set(pageTitle, linkTitles);

            await this.delay(RATE_LIMIT_DELAY);

            return linkTitles;
        } catch (error) {
            console.error(`Error fetching links for ${pageTitle}:`, error);
            return [];
        }
    }

    async getPageLinksWithContinuation(pageTitle, limit = 500) {
        if (this.cache.has(pageTitle)) {
            return this.cache.get(pageTitle);
        }

        const allLinks = [];
        let plcontinue = null;
        let iterations = 0;
        const maxIterations = Math.ceil(limit / 500);

        try {
            do {
                const params = {
                    action: 'query',
                    format: 'json',
                    titles: pageTitle,
                    prop: 'links',
                    pllimit: 500,
                    origin: '*'
                };

                if (plcontinue) {
                    params.plcontinue = plcontinue;
                }

                const response = await axios.get(WIKIPEDIA_API, { params });

                const pages = response.data.query.pages;
                const pageId = Object.keys(pages)[0];

                if (pageId === '-1') {
                    console.error(`Page not found: ${pageTitle}`);
                    break;
                }

                const links = pages[pageId].links || [];
                allLinks.push(...links.map(link => link.title));

                plcontinue = response.data.continue?.plcontinue;
                iterations++;

                await this.delay(RATE_LIMIT_DELAY);
            } while (plcontinue && iterations < maxIterations && allLinks.length < limit);

            const finalLinks = allLinks.slice(0, limit);
            this.cache.set(pageTitle, finalLinks);

            console.log(`Fetched ${finalLinks.length} links for ${pageTitle}`);
            return finalLinks;
        } catch (error) {
            console.error(`Error fetching links for ${pageTitle}:`, error);
            return [];
        }
    }

    async getMultiplePageLinks(pageTitles, linksPerPage = 100) {
        const results = {};

        for (const title of pageTitles) {
            console.log(`Fetching links for: ${title}`);
            results[title] = await this.getPageLinksWithContinuation(title, linksPerPage);
        }

        return results;
    }
}

module.exports = WikipediaAPI;
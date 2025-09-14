import requests
import time

class WikipediaFetcher:
    def __init__(self):
        self.base_url = 'https://en.wikipedia.org/w/api.php'
    
    def fetch_page_links(self, page_title):
        """Fetch all links from a Wikipedia page."""
        all_links = []
        continue_token = None
        iterations = 0
        
        while True:
            params = {
                'action': 'query',
                'format': 'json',
                'titles': page_title,
                'prop': 'links',
                'pllimit': 'max',  # Get maximum links per request (500)
                'origin': '*'
            }
            
            if continue_token:
                params['plcontinue'] = continue_token
            
            try:
                response = requests.get(self.base_url, params=params)
                data = response.json()
                
                pages = data['query']['pages']
                page_id = list(pages.keys())[0]
                
                if page_id == '-1':
                    print(f"Page not found: {page_title}")
                    return []
                
                links = pages[page_id].get('links', [])
                all_links.extend([link['title'] for link in links])
                
                iterations += 1
                print(f"  Fetched batch {iterations} for {page_title}: {len(links)} links")
                
                # Check for continuation
                if 'continue' in data:
                    continue_token = data['continue']['plcontinue']
                    time.sleep(0.1)  # Small delay to avoid rate limiting
                else:
                    break
                    
            except Exception as e:
                print(f"Error fetching links for {page_title}: {str(e)}")
                return all_links
        
        print(f"  Total links for {page_title}: {len(all_links)}")
        return all_links
    
    def fetch_multiple_pages(self, page_titles):
        """Fetch links for multiple Wikipedia pages."""
        results = {}
        
        for title in page_titles:
            print(f"Fetching links from: {title}")
            links = self.fetch_page_links(title)
            results[title] = links
            time.sleep(0.5)  # Delay between different pages
        
        return results
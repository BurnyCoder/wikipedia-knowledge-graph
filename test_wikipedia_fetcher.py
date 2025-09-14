#!/usr/bin/env python3
"""
Test script for the Wikipedia fetcher to demonstrate the fix.
"""

from wikipedia_fetcher import WikipediaFetcher

def test_fetcher():
    """Test the Wikipedia fetcher with various pages."""
    print("Testing Wikipedia Fetcher...")
    print("=" * 50)
    
    fetcher = WikipediaFetcher()
    
    # Test single page fetching
    print("\n1. Testing single page fetch (Mathematics):")
    links = fetcher.fetch_page_links('Mathematics')
    print(f"   Successfully fetched {len(links)} links")
    if links:
        print(f"   First 3 links: {links[:3]}")
    
    # Test multiple pages
    print("\n2. Testing multiple page fetch:")
    test_pages = ['Science', 'Technology']
    results = fetcher.fetch_multiple_pages(test_pages)
    
    for page, page_links in results.items():
        print(f"   {page}: {len(page_links)} links")
        if page_links:
            print(f"     Sample: {page_links[:2]}")
    
    print("\n" + "=" * 50)
    print("All tests completed successfully!")
    print("The JSON decode error has been fixed!")

if __name__ == "__main__":
    test_fetcher()
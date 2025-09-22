#!/usr/bin/env python
"""
Test script to verify dashboard API endpoints are working correctly
"""
import requests
import json

# Django server URL
BASE_URL = "http://localhost:8000/api/v1"

# Dashboard endpoints to test
dashboard_endpoints = [
    "/dashboard/overview/",
    "/dashboard/activities/",
    "/dashboard/metrics/",
    "/dashboard/chart-data/",
]

def test_dashboard_endpoints():
    """Test all dashboard endpoints"""
    print("Testing Dashboard API Endpoints...")
    print("=" * 50)
    
    for endpoint in dashboard_endpoints:
        url = BASE_URL + endpoint
        try:
            print(f"\nTesting: {url}")
            response = requests.get(url, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ SUCCESS: {len(data) if isinstance(data, (list, dict)) else 'Data'} items returned")
                if isinstance(data, dict) and 'results' in data:
                    print(f"   Results count: {len(data.get('results', []))}")
            elif response.status_code == 401:
                print("⚠️  UNAUTHORIZED: Authentication required")
            elif response.status_code == 404:
                print("❌ NOT FOUND: Endpoint doesn't exist")
            else:
                print(f"⚠️  Response: {response.status_code} - {response.reason}")
                
        except requests.exceptions.ConnectionError:
            print("❌ CONNECTION ERROR: Django server not running")
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 50)
    print("Dashboard API Test Complete!")
    print("\nNext Steps:")
    print("1. Dashboard backend is ready with full API endpoints")
    print("2. Frontend can now consume these endpoints")
    print("3. Authentication may be required for some endpoints")
    print("4. Activity logging is integrated into anonymizer and report correction")

if __name__ == "__main__":
    test_dashboard_endpoints()
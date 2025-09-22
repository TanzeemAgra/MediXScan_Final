#!/usr/bin/env python3
"""
Dashboard Integration Test Script
Tests the dashboard API endpoints and displays formatted results.
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1/dashboard"

def test_endpoint(endpoint_name, url):
    """Test a single dashboard endpoint"""
    try:
        print(f"\n🧪 Testing {endpoint_name}...")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS - {endpoint_name}")
            print(f"   Status: {response.status_code}")
            if 'data' in data:
                print(f"   Data Keys: {list(data['data'].keys())}")
                # Show a preview of some key metrics
                if 'total_activities' in str(data):
                    print(f"   📊 Has activity data")
                if 'total_anonymizations' in str(data):
                    print(f"   🔒 Has anonymization metrics")
                if 'total_corrections' in str(data):
                    print(f"   📝 Has correction metrics")
            return True
        else:
            print(f"❌ FAILED - {endpoint_name}")
            print(f"   Status: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"🔌 CONNECTION ERROR - Cannot reach {endpoint_name}")
        print("   Make sure Django server is running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ ERROR - {endpoint_name}: {str(e)}")
        return False

def main():
    """Run all dashboard endpoint tests"""
    print("=" * 60)
    print("🏥 MediXScan Dashboard Integration Test")
    print("=" * 60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    endpoints = [
        ("Dashboard Overview", f"{BASE_URL}/overview/"),
        ("Patient Statistics", f"{BASE_URL}/patient-stats/"),
        ("Appointment Statistics", f"{BASE_URL}/appointment-stats/"),
        ("Doctor Statistics", f"{BASE_URL}/doctor-stats/"),
        ("Recent Activities", f"{BASE_URL}/recent-activities/"),
        ("Chart Data - Overview", f"{BASE_URL}/chart-data/?type=overview"),
        ("Chart Data - Anonymizer", f"{BASE_URL}/chart-data/?type=anonymizer"),
        ("Chart Data - Report Corrections", f"{BASE_URL}/chart-data/?type=report_corrections"),
    ]
    
    results = []
    
    for name, url in endpoints:
        success = test_endpoint(name, url)
        results.append((name, success))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(1 for _, success in results if success)
    failed_tests = total_tests - passed_tests
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n📈 Overall Results:")
    print(f"   Total Tests: {total_tests}")
    print(f"   Passed: {passed_tests}")
    print(f"   Failed: {failed_tests}")
    print(f"   Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Dashboard integration is working correctly.")
        print("\n📋 Next Steps:")
        print("   1. ✅ Backend dashboard API is functional")
        print("   2. 🔄 Frontend should now load dashboard data successfully") 
        print("   3. 🌐 Visit http://localhost:5173/radiology/dashboard to see the dashboard")
        print("   4. 📱 Check for activity tracking in Report Correction and Anonymizer")
    else:
        print(f"\n⚠️  {failed_tests} test(s) failed. Please check the Django server and database.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
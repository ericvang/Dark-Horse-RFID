import time
import random
import requests

BASE_URL = "http://127.0.0.1:5000"

def get_all_rfids():
    try:
        response = requests.get(f"{BASE_URL}/items")
        response.raise_for_status()
        items = response.json()
        return [item["rfid"] for item in items]
    except Exception as e:
        print("Error fetching items:", e)
        return []

def send_scan(tags):
    try:
        response = requests.post(f"{BASE_URL}/scan", json={"tags": tags})
        response.raise_for_status()
        print(f"✅ Scanned: {tags}")
    except Exception as e:
        print("Error scanning tags:", e)

def run_mock_scanner(interval_seconds=15):
    while True:
        all_rfids = get_all_rfids()
        if not all_rfids:
            print("No items to scan.")
        else:
            # Randomly select ~70% of items to simulate detection
            scanned = random.sample(all_rfids, k=random.randint(0, len(all_rfids)))
            send_scan(scanned)

        time.sleep(interval_seconds)

if __name__ == "__main__":
    print("📡 Starting mock RFID reader...")
    run_mock_scanner()
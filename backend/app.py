from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

items = {}  # Stores item data keyed by RFID
scanned_tags = []  # List of currently scanned tag IDs


@app.route("/")
def index():
    return "Backend running!"


# ---------- RFID SCAN ROUTES ----------

@app.route('/scan', methods=['POST'])
def scan_tags():
    data = request.get_json()
    scanned_tags = data.get('tags')

    if not scanned_tags or not isinstance(scanned_tags, list):
        return jsonify({'error': 'Tags list is required'}), 400

    now = datetime.now()

    # Set detected for tags in scan
    for tag in scanned_tags:
        if tag in items:
            items[tag]["status"] = "detected"
            items[tag]["lastSeen"] = now.isoformat()

    # Set missing for tags not in scan
    for rfid, item in items.items():
        if rfid not in scanned_tags:
            item["status"] = "missing"

    return jsonify({"message": "Scan processed", "detected_tags": scanned_tags})


@app.route('/scanned', methods=['GET'])
def get_scanned_tags():
    return jsonify({'scanned_tags': scanned_tags})


@app.route('/reset', methods=['POST'])
def reset_status():
    for item in items.values():
        item["status"] = "missing"
    scanned_tags.clear()
    return jsonify({"message": "All item statuses reset"})


# ---------- ITEM ROUTES ----------

@app.route("/items", methods=["POST"])
def add_item():
    data = request.get_json()
    rfid = data.get("rfid")

    if not rfid:
        return jsonify({"error": "RFID is required"}), 400

    items[rfid] = {
        "id": data.get("id"),
        "name": data.get("name"),
        "description": data.get("description"),
        "rfid": rfid,
        "category": data.get("category", ""),
        "isEssential": data.get("isEssential", False),
        "status": data.get("status", "detected"),
        "lastSeen": data.get("lastSeen", None),
    }
    return jsonify({"message": "Item added", "item": items[rfid]}), 201


@app.route("/items", methods=["GET"])
def get_items():
    return jsonify(list(items.values()))


@app.route("/items/<rfid>", methods=["PATCH"])
def update_item_status(rfid):
    if rfid not in items:
        return jsonify({"error": "Item not found"}), 404

    items[rfid]["status"] = "detected"
    items[rfid]["lastSeen"] = datetime.now().isoformat()
    return jsonify({"message": "Item updated", "item": items[rfid]})


@app.route("/items/<rfid>", methods=["PUT"])
def update_item_details(rfid):
    if rfid not in items:
        return jsonify({"error": "Item not found"}), 404

    data = request.get_json()

    for field in ["id", "name", "description", "category", "isEssential", "status", "lastSeen"]:
        if field in data:
            items[rfid][field] = data[field]

    return jsonify({"message": f"Item {rfid} updated", "item": items[rfid]}), 200


@app.route("/items/<rfid>", methods=["DELETE"])
def delete_item(rfid):
    if rfid not in items:
        return jsonify({"error": "Item not found"}), 404

    del items[rfid]
    return jsonify({"message": f"Item {rfid} deleted"}), 200


# ---------- MAIN ----------

if __name__ == "__main__":
    app.run(debug=True)
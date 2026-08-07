import json
import os
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "percobaan.json")


def load_percobaan():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/percobaan")
def get_percobaan():
    data = load_percobaan()

    # Calculate optimal score for each batch
    for p in data:
        skor = (50 if p["berhasil_set"] else 0) + (p["skor_tekstur"] * 10)
        p["skor_optimal"] = skor

    # Sort: primary = highest optimal score, secondary = lowest temp, tertiary = shortest time
    data.sort(key=lambda p: (-p["skor_optimal"], p["suhu_c"], p["waktu_menit"]))

    for i, p in enumerate(data):
        p["rank"] = i + 1
        p["optimal"] = i == 0

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)

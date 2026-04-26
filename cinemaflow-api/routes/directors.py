from flask import Blueprint, jsonify, request

import models

director_bp = Blueprint("directors", __name__)


@director_bp.route("/api/directors", methods=["GET"])
def get_directors():
    return jsonify(models.directors)


@director_bp.route("/api/directors/<int:director_id>", methods=["GET"])
def get_director(director_id):
    director = next((item for item in models.directors if item["id"] == director_id), None)
    if director is None:
        return jsonify({"error": f"Director id={director_id} not found"}), 404
    return jsonify(director)


@director_bp.route("/api/directors/<int:director_id>/movies", methods=["GET"])
def get_director_movies(director_id):
    result = [movie for movie in models.movies if movie["directorId"] == director_id]
    return jsonify(result)


@director_bp.route("/api/directors", methods=["POST"])
def add_director():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return jsonify({"error": "name is required"}), 400

    new_director = {
        "id": models.next_director_id(),
        "name": data.get("name", "").strip(),
        "nationality": data.get("nationality", ""),
        "birthYear": int(data.get("birthYear") or 0),
        "bio": data.get("bio", ""),
    }
    models.directors.append(new_director)
    return jsonify(new_director), 201


@director_bp.route("/api/directors/<int:director_id>", methods=["PUT"])
def update_director(director_id):
    director = next((item for item in models.directors if item["id"] == director_id), None)
    if director is None:
        return jsonify({"error": f"Director id={director_id} not found"}), 404

    data = request.get_json(silent=True) or {}
    for key in ["name", "nationality", "birthYear", "bio"]:
        if key in data:
            director[key] = data[key]

    if not director.get("name"):
        return jsonify({"error": "name is required"}), 400

    return jsonify(director)


@director_bp.route("/api/directors/<int:director_id>", methods=["DELETE"])
def delete_director(director_id):
    director = next((item for item in models.directors if item["id"] == director_id), None)
    if director is None:
        return jsonify({"error": f"Director id={director_id} not found"}), 404

    models.directors[:] = [item for item in models.directors if item["id"] != director_id]
    return jsonify({"success": True, "deleted": director})

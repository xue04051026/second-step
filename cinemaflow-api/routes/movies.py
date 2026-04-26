from flask import Blueprint, jsonify, request

import models

movie_bp = Blueprint("movies", __name__)

MOVIE_FIELDS = [
    "title",
    "director",
    "directorId",
    "releaseDate",
    "rating",
    "isWatched",
    "genre",
    "runtime",
    "country",
    "language",
    "tagline",
    "summary",
    "posterUrl",
    "status",
]


def normalize_movie(data, movie_id):
    return {
        "id": movie_id,
        "title": data.get("title", "").strip(),
        "director": data.get("director", ""),
        "directorId": int(data.get("directorId") or 0),
        "releaseDate": data.get("releaseDate") or "",
        "rating": float(data.get("rating") or 0),
        "isWatched": bool(data.get("isWatched", False)),
        "genre": data.get("genre", ""),
        "runtime": data.get("runtime"),
        "country": data.get("country", ""),
        "language": data.get("language", ""),
        "tagline": data.get("tagline", ""),
        "summary": data.get("summary", ""),
        "posterUrl": data.get("posterUrl", "/assets/default-poster.jpg"),
        "status": data.get("status", "showing"),
    }


@movie_bp.route("/api/movies", methods=["GET"])
def get_movies():
    title = request.args.get("title", "").strip().lower()
    genre = request.args.get("genre", "").strip()
    result = models.movies

    if title:
        result = [movie for movie in result if title in movie["title"].lower()]
    if genre:
        result = [movie for movie in result if movie["genre"] == genre]

    return jsonify(result)


@movie_bp.route("/api/movies/<int:movie_id>", methods=["GET"])
def get_movie(movie_id):
    movie = next((item for item in models.movies if item["id"] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"Movie id={movie_id} not found"}), 404
    return jsonify(movie)


@movie_bp.route("/api/movies", methods=["POST"])
def add_movie():
    data = request.get_json(silent=True) or {}
    if not data.get("title"):
        return jsonify({"error": "title is required"}), 400

    new_movie = normalize_movie(data, models.next_movie_id())
    models.movies.append(new_movie)
    return jsonify(new_movie), 201


@movie_bp.route("/api/movies/<int:movie_id>", methods=["PUT"])
def update_movie(movie_id):
    movie = next((item for item in models.movies if item["id"] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"Movie id={movie_id} not found"}), 404

    data = request.get_json(silent=True) or {}
    for key in MOVIE_FIELDS:
        if key in data:
            movie[key] = data[key]

    if not movie.get("title"):
        return jsonify({"error": "title is required"}), 400

    return jsonify(movie)


@movie_bp.route("/api/movies/<int:movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    movie = next((item for item in models.movies if item["id"] == movie_id), None)
    if movie is None:
        return jsonify({"error": f"Movie id={movie_id} not found"}), 404

    models.movies[:] = [item for item in models.movies if item["id"] != movie_id]
    return jsonify({"success": True, "deleted": movie})

from flask import Flask
from flask_cors import CORS

from routes.directors import director_bp
from routes.movies import movie_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

app.register_blueprint(movie_bp)
app.register_blueprint(director_bp)


@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok", "service": "CinemaFlow API"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)

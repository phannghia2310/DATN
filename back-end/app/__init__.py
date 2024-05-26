from flask import Flask
from flask_restx import Api
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    api = Api(app)
    CORS(app, origins=['http://localhost:3000', 'http://example.com'])
    
    from app.routes import register_routes
    register_routes(api)
    
    return app
import toml

with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
    config = toml.load(f)

SECRET_KEY = config["jwt_secret_key"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 16
DOMAIN = config["hostname"]

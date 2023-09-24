import toml

def get_language_pack():
    with open('config/language.toml', mode="r", encoding='utf-8') as f:
        lang = toml.load(f)
    with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
        config = toml.load(f)

    current_language = config['language_pack']
    lang_release = lang['release'][current_language]
    return lang_release
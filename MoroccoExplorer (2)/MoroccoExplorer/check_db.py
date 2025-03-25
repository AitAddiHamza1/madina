import json
from app import app, db
from models import City, News

with app.app_context():
    cities = City.query.all()
    print(f'Number of cities: {len(cities)}')
    if cities:
        city_sample = [{'id': c.id, 'name_en': c.name_en} for c in cities[:5]]
        print(json.dumps(city_sample, indent=2))
    else:
        print('No cities found')

    news = News.query.all()
    print(f'\nNumber of news items: {len(news)}')
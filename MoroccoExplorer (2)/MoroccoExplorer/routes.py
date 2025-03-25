from flask import render_template, request, jsonify
from app import app, db
from models import City, News

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/city/<int:city_id>')
def city(city_id):
    city = City.query.get_or_404(city_id)
    return render_template('city.html', city=city)

@app.route('/news')
def news():
    news_items = News.query.order_by(News.date_posted.desc()).all()
    return render_template('news.html', news_items=news_items)

@app.route('/contact')
def contact():
    return render_template('contact.html')

# API Routes
@app.route('/api/cities')
def get_cities():
    cities = City.query.all()
    city_list = []
    for city in cities:
        city_list.append({
            'id': city.id,
            'name_en': city.name_en,
            'name_ar': city.name_ar,
            'latitude': city.latitude,
            'longitude': city.longitude,
            'region_en': city.region_en,
            'region_ar': city.region_ar,
            'population': city.population
        })
    return jsonify(city_list)

@app.route('/api/city/<int:city_id>')
def get_city(city_id):
    city = City.query.get_or_404(city_id)
    return jsonify({
        'id': city.id,
        'name_en': city.name_en,
        'name_ar': city.name_ar,
        'description_en': city.description_en,
        'description_ar': city.description_ar,
        'culture_en': city.culture_en,
        'culture_ar': city.culture_ar,
        'landmarks_en': city.landmarks_en,
        'landmarks_ar': city.landmarks_ar,
        'latitude': city.latitude,
        'longitude': city.longitude,
        'population': city.population,
        'region_en': city.region_en,
        'region_ar': city.region_ar
    })

@app.route('/api/news')
def get_news():
    news_items = News.query.order_by(News.date_posted.desc()).all()
    news_list = []
    for item in news_items:
        news_list.append({
            'id': item.id,
            'title_en': item.title_en,
            'title_ar': item.title_ar,
            'content_en': item.content_en,
            'content_ar': item.content_ar,
            'date_posted': item.date_posted.strftime('%Y-%m-%d %H:%M:%S'),
            'author': item.author,
            'image_url': item.image_url
        })
    return jsonify(news_list)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

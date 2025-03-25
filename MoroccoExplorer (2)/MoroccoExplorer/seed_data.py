from app import app, db
from models import City, News
from datetime import datetime

# Sample city data for Morocco
morocco_cities = [
    {
        'name_en': 'Casablanca',
        'name_ar': 'الدار البيضاء',
        'description_en': 'Casablanca is the largest city in Morocco and one of the largest financial centers in Africa. Located on the Atlantic coast, it is Morocco\'s chief port and industrial center.',
        'description_ar': 'الدار البيضاء هي أكبر مدينة في المغرب وواحدة من أكبر المراكز المالية في أفريقيا. تقع على ساحل المحيط الأطلسي، وهي الميناء الرئيسي للمغرب والمركز الصناعي.',
        'culture_en': 'Casablanca has a rich cultural heritage that blends Moroccan traditions with French colonial influence. The city is known for its vibrant art scene, music festivals, and diverse cuisine.',
        'culture_ar': 'تتمتع الدار البيضاء بتراث ثقافي غني يمزج بين التقاليد المغربية والتأثير الاستعماري الفرنسي. تشتهر المدينة بمشهدها الفني النابض بالحياة والمهرجانات الموسيقية والمأكولات المتنوعة.',
        'landmarks_en': 'Hassan II Mosque, Old Medina, Morocco Mall, Ain Diab Corniche, Royal Palace of Casablanca',
        'landmarks_ar': 'مسجد الحسن الثاني، المدينة القديمة، مول المغرب، كورنيش عين الذياب، القصر الملكي بالدار البيضاء',
        'latitude': 33.5731,
        'longitude': -7.5898,
        'population': 3360000,
        'region_en': 'Casablanca-Settat',
        'region_ar': 'الدار البيضاء-سطات'
    },
    {
        'name_en': 'Rabat',
        'name_ar': 'الرباط',
        'description_en': 'Rabat is the capital city of Morocco and is located on the Atlantic Ocean at the mouth of the river Bou Regreg. It is known for its Islamic and French-colonial heritage.',
        'description_ar': 'الرباط هي عاصمة المغرب وتقع على المحيط الأطلسي عند مصب نهر أبي رقراق. تشتهر بتراثها الإسلامي والاستعماري الفرنسي.',
        'culture_en': 'As the capital, Rabat represents a blend of traditional Moroccan and modern culture. It hosts numerous cultural events, royal ceremonies, and diplomatic activities.',
        'culture_ar': 'بصفتها العاصمة، تمثل الرباط مزيجًا من الثقافة المغربية التقليدية والحديثة. تستضيف العديد من الفعاليات الثقافية والاحتفالات الملكية والأنشطة الدبلوماسية.',
        'landmarks_en': 'Hassan Tower, Kasbah of the Udayas, Royal Palace, Chellah Necropolis, Mohammed VI Museum of Modern and Contemporary Art',
        'landmarks_ar': 'صومعة حسان، قصبة الوداية، القصر الملكي، موقع شالة الأثري، متحف محمد السادس للفن الحديث والمعاصر',
        'latitude': 34.0209,
        'longitude': -6.8416,
        'population': 577827,
        'region_en': 'Rabat-Salé-Kénitra',
        'region_ar': 'الرباط-سلا-القنيطرة'
    },
    {
        'name_en': 'Marrakech',
        'name_ar': 'مراكش',
        'description_en': 'Marrakech is a major city in the Kingdom of Morocco and the fourth largest city in the country after Casablanca, Fez and Tangier. It is located to the north of the foothills of the snow-capped Atlas Mountains.',
        'description_ar': 'مراكش هي مدينة رئيسية في المملكة المغربية ورابع أكبر مدينة في البلاد بعد الدار البيضاء وفاس وطنجة. تقع إلى الشمال من سفوح جبال الأطلس المغطاة بالثلوج.',
        'culture_en': 'Marrakech is known for its vibrant souks, gardens, palaces, and traditional Moroccan cuisine. The city has a rich history as an important cultural, religious, and trading center.',
        'culture_ar': 'تشتهر مراكش بأسواقها النابضة بالحياة وحدائقها وقصورها ومطبخها المغربي التقليدي. تتمتع المدينة بتاريخ غني كمركز ثقافي وديني وتجاري مهم.',
        'landmarks_en': 'Jemaa el-Fnaa, Koutoubia Mosque, Bahia Palace, Majorelle Garden, Saadian Tombs',
        'landmarks_ar': 'ساحة جامع الفنا، مسجد الكتبية، قصر الباهية، حديقة ماجوريل، ضريح السعديين',
        'latitude': 31.6295,
        'longitude': -7.9811,
        'population': 928850,
        'region_en': 'Marrakech-Safi',
        'region_ar': 'مراكش-آسفي'
    },
    {
        'name_en': 'Fez',
        'name_ar': 'فاس',
        'description_en': 'Fez is the second largest city of Morocco and the former capital. It is one of the imperial cities of Morocco and is known for its well-preserved medieval old city, the Medina of Fez.',
        'description_ar': 'فاس هي ثاني أكبر مدينة في المغرب والعاصمة السابقة. وهي واحدة من المدن الإمبراطورية في المغرب ومعروفة بمدينتها القديمة التي تحتفظ بطابعها القروسطي، مدينة فاس القديمة.',
        'culture_en': 'Fez is considered the cultural and spiritual capital of Morocco, famous for its ancient learning institutions, craftsmanship, and traditional music.',
        'culture_ar': 'تعتبر فاس العاصمة الثقافية والروحية للمغرب، وتشتهر بمؤسساتها التعليمية القديمة والحرف اليدوية والموسيقى التقليدية.',
        'landmarks_en': 'University of Al Quaraouiyine, Bou Inania Madrasa, Dar Batha, Merenid Tombs, Al-Attarine Madrasa',
        'landmarks_ar': 'جامعة القرويين، مدرسة بو عنانية، دار الباثا، قبور المرينيين، مدرسة العطارين',
        'latitude': 34.0181,
        'longitude': -5.0078,
        'population': 1112072,
        'region_en': 'Fès-Meknès',
        'region_ar': 'فاس-مكناس'
    },
    {
        'name_en': 'Tangier',
        'name_ar': 'طنجة',
        'description_en': 'Tangier is a major city in northwestern Morocco. It is located on the Maghreb coast at the western entrance to the Strait of Gibraltar, where the Mediterranean Sea meets the Atlantic Ocean.',
        'description_ar': 'طنجة هي مدينة رئيسية في شمال غرب المغرب. تقع على ساحل المغرب عند المدخل الغربي لمضيق جبل طارق، حيث يلتقي البحر الأبيض المتوسط بالمحيط الأطلسي.',
        'culture_en': 'Tangier has a rich international history, having been a strategic gateway between Africa and Europe. The city has attracted many artists, writers, and musicians over the years.',
        'culture_ar': 'تتمتع طنجة بتاريخ دولي غني، كونها بوابة استراتيجية بين أفريقيا وأوروبا. جذبت المدينة العديد من الفنانين والكتاب والموسيقيين على مر السنين.',
        'landmarks_en': 'Kasbah Museum, Caves of Hercules, Cap Spartel, Grand Socco, American Legation',
        'landmarks_ar': 'متحف القصبة، مغارات هرقل، رأس سبارتيل، السوكو الكبير، المفوضية الأمريكية',
        'latitude': 35.7595,
        'longitude': -5.8340,
        'population': 947952,
        'region_en': 'Tanger-Tétouan-Al Hoceima',
        'region_ar': 'طنجة-تطوان-الحسيمة'
    },
    {
        'name_en': 'Agadir',
        'name_ar': 'أكادير',
        'description_en': 'Agadir is a major city in Morocco located on the shore of the Atlantic Ocean, in the southern part of the country. It is an important fishing and commercial port.',
        'description_ar': 'أكادير هي مدينة كبيرة في المغرب تقع على شاطئ المحيط الأطلسي، في الجزء الجنوبي من البلاد. وهي ميناء مهم للصيد والتجارة.',
        'culture_en': 'Rebuilt after a devastating earthquake in 1960, Agadir is a modern city known for its beach resorts and Berber cultural influences.',
        'culture_ar': 'أعيد بناؤها بعد زلزال مدمر في عام 1960، أكادير هي مدينة حديثة معروفة بمنتجعاتها الشاطئية وتأثيرات الثقافة الأمازيغية.',
        'landmarks_en': 'Agadir Beach, Kasbah, Souk El Had, Valley of the Birds, Museum of Amazigh Culture',
        'landmarks_ar': 'شاطئ أكادير، القصبة، سوق الأحد، وادي الطيور، متحف الثقافة الأمازيغية',
        'latitude': 30.4278,
        'longitude': -9.5981,
        'population': 421844,
        'region_en': 'Souss-Massa',
        'region_ar': 'سوس-ماسة'
    },
    {
        'name_en': 'Meknes',
        'name_ar': 'مكناس',
        'description_en': 'Meknes is one of the four Imperial cities of Morocco and the sixth largest city by population. Founded in the 11th century by the Almoravids as a military settlement.',
        'description_ar': 'مكناس هي واحدة من المدن الإمبراطورية الأربع في المغرب وسادس أكبر مدينة من حيث عدد السكان. تأسست في القرن الحادي عشر من قبل المرابطين كمستوطنة عسكرية.',
        'culture_en': 'Meknes is known for its impressive monuments, historical buildings, and blend of Islamic and European styles, particularly from the 17th century Alaouite period.',
        'culture_ar': 'تشتهر مكناس بآثارها المثيرة للإعجاب ومبانيها التاريخية ومزيجها من الأساليب الإسلامية والأوروبية، خاصة من فترة العلويين في القرن السابع عشر.',
        'landmarks_en': 'Bab Mansour Gate, Heri es-Souani, Mausoleum of Moulay Ismail, Dar Jamai Museum, Place el-Hedim',
        'landmarks_ar': 'باب منصور، هري السواني، ضريح مولاي إسماعيل، متحف دار الجامعي، ساحة الهديم',
        'latitude': 33.8969,
        'longitude': -5.5551,
        'population': 632079,
        'region_en': 'Fès-Meknès',
        'region_ar': 'فاس-مكناس'
    },
    {
        'name_en': 'Oujda',
        'name_ar': 'وجدة',
        'description_en': 'Oujda is a city in eastern Morocco, located near the border with Algeria. It is the capital of the Oriental region and was founded in 994 by Ziri ibn Atiyya.',
        'description_ar': 'وجدة هي مدينة في شرق المغرب، تقع بالقرب من الحدود مع الجزائر. وهي عاصمة منطقة الشرق وقد أسسها زيري بن عطية عام 994.',
        'culture_en': 'Oujda has a rich cultural diversity due to its location at the crossroads of several civilizations. The city is known for its music, particularly Gharnati, and its annual festival.',
        'culture_ar': 'تتمتع وجدة بتنوع ثقافي غني بسبب موقعها عند مفترق طرق العديد من الحضارات. تشتهر المدينة بموسيقاها، خاصة الغرناطي، ومهرجانها السنوي.',
        'landmarks_en': 'Medina of Oujda, Lalla Meriem Park, Oujda Angads Airport, Central Market, Sidi Yahya Oasis',
        'landmarks_ar': 'مدينة وجدة القديمة، حديقة للا مريم، مطار وجدة أنجاد، السوق المركزي، واحة سيدي يحيى',
        'latitude': 34.6805,
        'longitude': -1.9006,
        'population': 551767,
        'region_en': 'Oriental',
        'region_ar': 'الشرق'
    },
    {
        'name_en': 'Essaouira',
        'name_ar': 'الصويرة',
        'description_en': 'Essaouira is a port city on Morocco\'s Atlantic coast. Its medina (old town) is protected by 18th-century seafront ramparts called the Skala de la Kasbah.',
        'description_ar': 'الصويرة هي مدينة ميناء على ساحل المحيط الأطلسي في المغرب. تحمي مدينتها القديمة أسوار من القرن الثامن عشر تسمى سكالة القصبة.',
        'culture_en': 'Essaouira has a diverse cultural heritage influenced by Berber, Arab, Jewish, and European traditions. It is famous for its music, art, and annual Gnaoua World Music Festival.',
        'culture_ar': 'تتمتع الصويرة بتراث ثقافي متنوع متأثر بالتقاليد الأمازيغية والعربية واليهودية والأوروبية. وهي مشهورة بموسيقاها وفنها ومهرجان كناوة العالمي للموسيقى السنوي.',
        'landmarks_en': 'Skala du Port, Medina, Essaouira Beach, Sidi Mohammed Ben Abdallah Museum, Synagogue Slat Lkahal',
        'landmarks_ar': 'سكالة المرفأ، المدينة القديمة، شاطئ الصويرة، متحف سيدي محمد بن عبد الله، معبد صلاة الكحل',
        'latitude': 31.5085,
        'longitude': -9.7595,
        'population': 77966,
        'region_en': 'Marrakech-Safi',
        'region_ar': 'مراكش-آسفي'
    },
    {
        'name_en': 'Chefchaouen',
        'name_ar': 'شفشاون',
        'description_en': 'Chefchaouen is a city in northwest Morocco. It is known for the striking blue-washed buildings of its old town (medina). The city was founded in 1471 as a small fortress.',
        'description_ar': 'شفشاون هي مدينة في شمال غرب المغرب. تشتهر بمبانيها ذات اللون الأزرق في مدينتها القديمة. تأسست المدينة عام 1471 كحصن صغير.',
        'culture_en': 'Chefchaouen has a rich cultural heritage influenced by Andalusian, Arab, and Berber traditions. The distinctive blue color of the buildings is said to symbolize the sky and heaven.',
        'culture_ar': 'تتمتع شفشاون بتراث ثقافي غني متأثر بالتقاليد الأندلسية والعربية والأمازيغية. يقال أن اللون الأزرق المميز للمباني يرمز إلى السماء والجنة.',
        'landmarks_en': 'Plaza Uta el-Hammam, Kasbah Museum, Ras El Ma (Waterfall), Grand Mosque, Outa El Hammam Square',
        'landmarks_ar': 'ساحة أوتا الحمام، متحف القصبة، رأس الماء (الشلال)، المسجد الكبير، ساحة أوتا الحمام',
        'latitude': 35.1715,
        'longitude': -5.2697,
        'population': 42786,
        'region_en': 'Tanger-Tétouan-Al Hoceima',
        'region_ar': 'طنجة-تطوان-الحسيمة'
    }
]

# Sample news data for Morocco
morocco_news = [
    {
        'title_en': 'Morocco Hosts International Film Festival',
        'title_ar': 'المغرب يستضيف مهرجان السينما الدولي',
        'content_en': 'The annual Marrakech International Film Festival returns this year with an impressive lineup of movies from around the world. The event will feature premieres, workshops, and appearances by acclaimed directors and actors.',
        'content_ar': 'يعود مهرجان مراكش الدولي للفيلم هذا العام بمجموعة مثيرة للإعجاب من الأفلام من جميع أنحاء العالم. سيتضمن الحدث عروضًا أولى وورش عمل وظهور مخرجين وممثلين مشهورين.',
        'author': 'Mohammed El Fassi',
        'image_url': 'https://images.unsplash.com/photo-1565377019749-65b5db62abc1'
    },
    {
        'title_en': 'New High-Speed Rail Line Connects Casablanca to Tangier',
        'title_ar': 'خط سكة حديد فائق السرعة جديد يربط الدار البيضاء بطنجة',
        'content_en': 'Morocco\'s new high-speed rail service, Al Boraq, has significantly reduced travel time between Casablanca and Tangier. The train reaches speeds of up to 320 km/h, making the journey in just over two hours.',
        'content_ar': 'خدمة السكك الحديدية المغربية الجديدة فائقة السرعة، البراق، قللت بشكل كبير من وقت السفر بين الدار البيضاء وطنجة. يصل القطار إلى سرعات تصل إلى 320 كم/ساعة، مما يجعل الرحلة تستغرق أكثر من ساعتين بقليل.',
        'author': 'Laila Bensouda',
        'image_url': 'https://images.unsplash.com/photo-1582559934242-8e0d34627474'
    },
    {
        'title_en': 'Morocco Makes Progress on Renewable Energy Goals',
        'title_ar': 'المغرب يحرز تقدماً في أهداف الطاقة المتجددة',
        'content_en': 'Morocco continues to expand its renewable energy capacity with new solar and wind projects. The country aims to generate 52% of its electricity from renewable sources by 2030, making it a leader in green energy in Africa and the Arab world.',
        'content_ar': 'يواصل المغرب توسيع قدرته على الطاقة المتجددة من خلال مشاريع الطاقة الشمسية وطاقة الرياح الجديدة. تهدف البلاد إلى توليد 52٪ من كهربائها من مصادر متجددة بحلول عام 2030، مما يجعلها رائدة في مجال الطاقة الخضراء في إفريقيا والعالم العربي.',
        'author': 'Karim Bouamar',
        'image_url': 'https://images.unsplash.com/photo-1509391366360-2e959784a276'
    },
    {
        'title_en': 'Traditional Moroccan Crafts Gain International Recognition',
        'title_ar': 'الحرف المغربية التقليدية تكتسب اعترافًا دوليًا',
        'content_en': 'Moroccan traditional crafts, including carpet weaving, pottery, and leather working, are gaining increasing recognition in international markets. Artisans from Fez and Marrakech have been invited to showcase their work at exhibitions in Europe and North America.',
        'content_ar': 'تكتسب الحرف التقليدية المغربية، بما في ذلك نسج السجاد والفخار وصناعة الجلود، اعترافًا متزايدًا في الأسواق الدولية. تمت دعوة الحرفيين من فاس ومراكش لعرض أعمالهم في معارض في أوروبا وأمريكا الشمالية.',
        'author': 'Salma Tazi',
        'image_url': 'https://images.unsplash.com/photo-1554454188-966e5a1d7513'
    },
    {
        'title_en': 'Morocco\'s Tourism Sector Recovers Post-Pandemic',
        'title_ar': 'قطاع السياحة في المغرب يتعافى بعد الجائحة',
        'content_en': 'Morocco\'s tourism industry is showing strong signs of recovery following the COVID-19 pandemic. Visitor numbers have increased significantly over the past year, with European and Middle Eastern tourists returning to popular destinations like Marrakech, Fez, and Chefchaouen.',
        'content_ar': 'تظهر صناعة السياحة في المغرب علامات قوية على التعافي بعد جائحة كوفيد-19. زادت أعداد الزوار بشكل كبير خلال العام الماضي، مع عودة السياح الأوروبيين والشرق أوسطيين إلى وجهات شعبية مثل مراكش وفاس وشفشاون.',
        'author': 'Yasmine Alaoui',
        'image_url': 'https://images.unsplash.com/photo-1539020140153-e69a26a70964'
    }
]

def create_sample_data():
    try:
        # Delete existing data first (clean start)
        City.query.delete()
        News.query.delete()
        db.session.commit()
        
        print("Adding sample cities...")
        for city_data in morocco_cities:
            city = City(**city_data)
            db.session.add(city)
        
        print("Adding sample news...")
        for news_data in morocco_news:
            news_item = News(
                title_en=news_data['title_en'],
                title_ar=news_data['title_ar'],
                content_en=news_data['content_en'],
                content_ar=news_data['content_ar'],
                author=news_data['author'],
                image_url=news_data['image_url'],
                date_posted=datetime.now()
            )
            db.session.add(news_item)
        
        db.session.commit()
        print("Sample data added successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")

# Run the function within the app context
with app.app_context():
    create_sample_data()
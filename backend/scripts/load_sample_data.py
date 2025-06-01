# scripts/load_sample_data.py

from events.models import Category

def run():
    categories = ["Music", "Art", "Theater", "Dance", "Film", "Literature", "Food", "Sports", "Technology", "Education"]
    for name in categories:
        obj, created = Category.objects.get_or_create(name=name)
        if created:
            print(f"Category created: {name}")
        else:
            print(f"Category already exists: {name}")
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["atlaspredict"]
collection = db["predictions"]

sample_data = {"test": "MongoDB is working!"}
collection.insert_one(sample_data)

print("✅ Inserted test document:", collection.find_one({"test": "MongoDB is working!"}))

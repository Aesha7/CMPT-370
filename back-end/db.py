from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class DB_Connection(object):
    def __init__(self):
        # Connecting to MongoDB: 
        # DB password: CPj0i24mLlKvkskt
        self.uri = "mongodb+srv://CMPT370Team25DB:CPj0i24mLlKvkskt@cmpt370db.godfxkb.mongodb.net/?retryWrites=true&w=majority"
        
        # Create a new client and connect to the server
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        
        # Send a ping to confirm a successful connection
        try:
            self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        
def readDocuments(collection):
    """Example function for retrieving document. 

    Args:
        collection (Collection): collection to be accessed
    """
    result = collection.find()
    if result:
        for doc in result:
            print("Name: "+ doc['name'])
            print("Email: "+ doc['email'])
    else:
        print("Error: no documents found.")

# readDocuments(my_collection)

def addDocument(collection,doc):
    """Example function for adding a document to a collection.

    Args:
        collection (Collection): collection to be accessed
        doc (String): key-value pairs that define document
    """
    collection.insert_one(doc)

# newDocument = {"name":"John Doe", "email": "john@email.com", "age": 69}
# addDocument(my_collection,newDocument)

#Access database and collection "db_1" (placeholder collection)
# db = client.CMPT370_Team25
# my_collection = db["db_1"]
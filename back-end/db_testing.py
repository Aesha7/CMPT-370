from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def add_admin (accounts_collection):
    account_details = {
        "_id": ObjectId("000000000000000000000000"),
        "email": "admin@test.com",
        "waiver": True,
        "password": "password",
        "phone": "1112222222",
        "staffLevel": 3,
        "news": False,
        "prom": True,
        "teaching": [], #list of events/courses parent of account leads - should always be empty for non-coaches, but it's convenient to add here
        "users": [{ #doesn't add birthday/phone
            "_id": ObjectId(),
            "name": "admin_name",
            "level": 1,
            "isParent": True,
            "courses":[],
            "events":[],
        }]
    }
    
    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Adds document to collection 
    accounts_collection.insert_one(account_details)
    resp.data = dumps("Success")
    return resp

def add_skill_test_account (accounts_collection):
    account_details = {
        "_id": ObjectId("000000000000000000000001"),
        "email": "skills@test.com",
        "waiver": True,
        "password": "password",
        "phone": "1112222222",
        "staffLevel": 0,
        "news": False,
        "prom": True,
        "teaching": [], #list of events/courses parent of account leads - should always be empty for non-coaches, but it's convenient to add here
        "users": [{ #doesn't add birthday/phone
            "_id": ObjectId(),
            "name": "user1",
            "level": 1,
            "isParent": True,
            "courses":[],
            "events":[],
            "skills":{"lv_1":[{"name":"1.1","desc":"desc","checked":True},{"name":"1.2","desc":"desc","checked":False},{"name":"1.3","desc":"desc","checked":False}],
                      "lv_2":[{"name":"2.1","desc":"desc","checked":True},{"name":"2.2","desc":"desc","checked":False},{"name":"2.3","desc":"desc","checked":False}],
                      "lv_3":[{"name":"3.1","desc":"desc","checked":False},{"name":"3.2","desc":"desc","checked":True},{"name":"3.3","desc":"desc","checked":False}],
                      "lv_4":[{"name":"4.1","desc":"desc","checked":False},{"name":"4.2","desc":"desc","checked":False},{"name":"4.3","desc":"desc","checked":True}],
                      "lv_5":[{"name":"5.1","desc":"desc","checked":False},{"name":"5.2","desc":"desc","checked":False},{"name":"5.3","desc":"desc","checked":False}]}
        },{ 
            "_id": ObjectId(),
            "name": "user2",
            "level": 1,
            "isParent": False,
            "courses":[],
            "events":[],
            "skills":{"lv_1":[{"name":"1.1","desc":"desc","checked":True},{"name":"1.2","desc":"desc","checked":False},{"name":"1.3","desc":"desc","checked":False}],
                      "lv_2":[{"name":"2.1","desc":"desc","checked":True},{"name":"2.2","desc":"desc","checked":False},{"name":"2.3","desc":"desc","checked":False}],
                      "lv_3":[{"name":"3.1","desc":"desc","checked":False}],
                      "lv_4":[{"name":"4.1","desc":"desc","checked":False},{"name":"4.2","desc":"desc","checked":False},{"name":"4.3","desc":"desc","checked":True}],
                      "lv_5":[{"name":"5.1","desc":"desc","checked":False},{"name":"5.2","desc":"desc","checked":False},{"name":"5.3","desc":"desc","checked":False}]}
        },{ 
            "_id": ObjectId(),
            "name": "user3",
            "level": 1,
            "isParent": False,
            "courses":[],
            "events":[],
            "skills":{"lv_1":[{"name":"old","desc":"desc","checked":True},{"name":"1.2","desc":"desc","checked":False},{"name":"1.3","desc":"desc","checked":False}],
                      "lv_2":[{"name":"2.1","desc":"desc","checked":True},{"name":"old","desc":"desc","checked":False},{"name":"2.3","desc":"desc","checked":False}],
                      "lv_3":[{"name":"3.1","desc":"desc","checked":False},{"name":"3.2","desc":"desc","checked":True},{"name":"3.3","desc":"desc","checked":False}],
                      "lv_4":[{"name":"4.1","desc":"desc","checked":False},{"name":"4.2","desc":"desc","checked":False},{"name":"4.3","desc":"desc","checked":True}],
                      "lv_5":[{"name":"5.1","desc":"desc","checked":False},{"name":"5.2","desc":"desc","checked":False},{"name":"5.3","desc":"desc","checked":False}]}
        }]
    }
    
    # Response
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    # Adds document to collection 
    accounts_collection.insert_one(account_details)
    return resp

def clear_collection(col):
    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    col.delete_many({})
    return resp
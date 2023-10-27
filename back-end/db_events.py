# For additional documentation, please see server.py

from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def retrieve(request_data, collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    ev = collection.find()
    ev_list=[]
    for i in ev:
        ev_list.append(i)
    resp.data = dumps(ev_list)
    return resp

def get(request_data, collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'
    ev = collection.find_one({"name": request_data["name"]})
    if ev:
        resp.data=dumps(ev)
        return resp
    else:
        resp.data=dumps("Error: course not found")
        resp.status_code=400
        return resp
    
def add(request_data, collection):
    event_details = {
        "name": request_data["name"],
        "enrolled": []
    }

    resp=Response()
    resp.headers['Access-Control-Allow-Headers'] = '*'

    if collection.find_one({"name": request_data["name"]}):
        resp.status_code=400
        resp.data=dumps("Error: event name already exists")
        return resp
    else:
        collection.insert_one(event_details)
        return resp
from flask import Response
from bson.objectid import ObjectId
from bson.json_util import dumps

def update_skill_template(request_data, templates_collection, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    # Check admin account credentials
    admin_account= accounts_collection.find_one({"_id": ObjectId(request_data["_id"])})
    if not admin_account:
        resp.status_code=400
        resp.data=dumps("Error: admin account not found")
        return resp
    if not (admin_account["staffLevel"]>0):
        resp.status_code=400
        resp.data=dumps("Error: you do not have permission to perform this action")
        return resp

    template = templates_collection.find_one({"_id":ObjectId("655f999ef7b243b45b4919f1")}) #ObjectId of skill template in db
    for account in accounts_collection.find({}):
        for user in account["users"]:
            user_skills = user.get("skills")
            updated_skills = {"lv_1":[],"lv_2":[],"lv_3":[],"lv_4":[],"lv_5":[]} # blank skills list to fill
            if user_skills == None: # If user didn't have skills initialized, initializes
                accounts_collection.update_one({"_id": account["_id"],"users._id": user["_id"]}, 
                                                        {"$set":{"users.$.skills" : template}})
            # Standard case
            else:
                for skill_lv in ["lv_1", "lv_2","lv_3","lv_4","lv_5"]: # Goes through all skill levels (objects)
                    for template_skill in template[skill_lv]:
                        skill_found = False # haven't found this skill in the user's old list yet
                        for user_skill in user_skills[skill_lv]:
                            if user_skill["name"]==template_skill["name"]: 
                                updated_skills[skill_lv].append(user_skill) # appends the user's version of the skill (to keep 'checked' value)
                                skill_found = True
                                break
                        if not skill_found:
                            updated_skills[skill_lv].append(template_skill) # appends the template version of skill
            
                # Update user's list with new version
                accounts_collection.update_one({"_id": account["_id"],"users._id": user["_id"]}, 
                                            {"$set":{"users.$.skills" : updated_skills}})
    return resp

def get_skills(request_data, accounts_collection):
    resp = Response()
    resp.headers['Access-Control-Allow-Headers']="*"

    # Check account credentials
    account= accounts_collection.find_one({"email": request_data["email"]})
    if not account:
        resp.status_code=400
        resp.data=dumps("Error: account not found (from email)")
        return resp
    if not ((account["_id"]==ObjectId(request_data["_id"]))): # If user's _id doesn't match requested account's id 
        x = accounts_collection.find_one({"_id":ObjectId(request_data["_id"])})
        if not x:
            resp.status_code=400
            resp.data=dumps("Error: account not found (from _id)")
            return resp
        if not (x["staffLevel"] > 0):
            resp.status_code=400
            resp.data=dumps("Error: you do not have permission to perform this action")
            return resp
    
    dict = {}
    for user in account["users"]:
        dict[user["name"]]=user["skills"]
    resp.data=dumps(dict)
    return resp
    

    



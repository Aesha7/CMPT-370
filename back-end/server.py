from flask import Flask
import db as db

app = Flask(__name__)
@app.route("/members")
def members():
    return {"members": ["M1", "M2", "M3"]}

if(__name__ == "__main__"):
    app.run(debug=True)

# Connects to database
database = db.DB_Connection()


# To run: cd into the back-end directory

# Set-ExecutionPolicy Unrestricted -Scope Process
# (Allows you to run the script to start the venv)

# .\windowsVenv\Scripts\activate
# to actually start the venv

# py server.py
# to actually run the back end server

# Kiran: When I tried to run the front end I got an error: 'error:03000086:digital envelope routines::initialization error'
#Fix was to run the following in the terminal 
#set NODE_OPTIONS=--openssl-legacy-provider


#CTRL + c to stop the local server




######### TO RUN THE FRONT END ##########

# cd into front-end
# npm start

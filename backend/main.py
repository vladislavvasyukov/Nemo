from sanic import Sanic
from sanic.response import json, file

app = Sanic()

app.static('/', './frontend')

@app.route("/")
async def index(request):
    print('in index')
    return await file('frontend/index.html')

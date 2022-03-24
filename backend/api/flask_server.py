from flask import Flask, request
from multiprocessing import Process, Queue
from opm_algo.opm_update import opm_update
from event_generation.set_config import set_settings, set_filters
import json

app = Flask(__name__)


@app.route('/api/update')
def update():
    global p
    p = Process(target=opm_update,args=('csv', 'dfg', 'dfg'))
    p.start()
    throughput_time = Queue.get()
    return(
        {
            'response': throughput_time
        }
    )

@app.route('/api/config/filters/eventAttribute/get', methods=['GET'])
def getConfigFiltersEventAttribute():
    f = open('config.json')
    config = json.load(f)
    fields = config['eventAttributes']
    print(fields)
    return(
        {
            'response': fields
        }
    )

@app.route('/api/config/filters/get', methods=['GET'])
def getConfigFilters():
    f = open('config.json')
    config = json.load(f)
    fields = config['filters']
    print(fields)
    return(
        {
            'response': fields
        }
    )

@app.route('/api/config/filters/post', methods=['POST'])
def postConfigFilters():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        set_filters(json)
        return "json"
    else:
        return 'Content-Type not supported!'

@app.route('/api/config/get', methods=['GET'])
def getSettings():
    f = open('config.json')
    config = json.load(f)
    fields = config
    return(
        {
            'response': fields
        }
    )

@app.route('/api/config/post', methods=['POST'])
def postSettings():
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        set_settings(json)
        return "json"
    else:
        return 'Content-Type not supported!'


def app_run():
    app.run()
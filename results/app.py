from collections import Counter
import math
import os

from flask import Flask, render_template, request, make_response, g, jsonify
import redis

from werkzeug.contrib.fixers import ProxyFix


app = Flask(__name__)

def get_redis():
    if not hasattr(g, 'redis_client'):
        redis_host = os.getenv('REDIS_HOST', '127.0.0.1')
        redis_port = os.getenv('REDIS_PORT', 6379)
        g.redis_client = redis.StrictRedis(host=redis_host, port=int(redis_port))
    return g.redis_client

@app.route("/", methods=['GET'])
def get_results():
    redis_client = get_redis()
    my_list = redis_client.lrange('votes', 0, -1)
    results = Counter(my_list)
    ret_val = dict(results)
    # Turn to percent
    for key in ret_val:
        percent = int(math.floor((float(ret_val[key]) / float(len(my_list))) * 100))
        ret_val[key] = "{}%".format(percent)
    return make_response(render_template('result.html', results=ret_val))


if __name__ == '__main__':
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.run(host=os.getenv('WEB_HOST', 'localhost'), port=os.getenv('WEB_PORT', 8000))


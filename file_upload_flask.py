from __future__ import print_function
from flask import Flask, render_template, request
from werkzeug import secure_filename
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np

from PIL import Image
import matplotlib.pyplot as plt

app = Flask(__name__)
cors = CORS(app)

@app.route('/upload', methods=['POST'])
def _upload_file():
  content = request.get_json(silent=True)
  # print(content)
  if 'image' in content:
    image = np.asarray(content['image'], dtype='uint8')
    # print(image.shape)
    img = Image.fromarray(image)
    # plt.imshow(image)
    # plt.show()
    img.save('flask_data/test_image.png')
    print('successfully save')

  return 'helloworld'


@app.route('/uploader', methods=['POST'])
def upload_file():
  if request.method == 'POST':
    f = request.files['file']
    f.save(secure_filename(f.filename))
    print(f.filename)
    # img = Image.open(f.filename)

    return jsonify({'result': True})


if __name__ == '__main__':
  # app.run(debug=True, port=8080)
  app.run(host='0.0.0.0', port=8080, debug=False)

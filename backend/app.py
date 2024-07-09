from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import os
import uuid
import base64
from io import BytesIO

# Set matplotlib backend to avoid GUI threading issues
matplotlib.use('agg')  # 'agg' backend is for non-interactive image generation

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['STATIC_FOLDER'] = 'static'

@app.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()

        if 'file' not in data or 'graph_type' not in data:
            return jsonify({'error': 'Missing file or graph_type in request data'}), 400

        file_base64 = data['file']
        graph_type = data['graph_type']

        # Decode the base64 file
        file_content = base64.b64decode(file_base64)
        df = pd.read_csv(BytesIO(file_content))

        # Generate a unique filename for the output image
        output_filename = str(uuid.uuid4()) + '.png'
        output_filepath = os.path.join(app.config['STATIC_FOLDER'], output_filename)

        # Generate the graph and save it
        plot_csv(df, graph_type, output_filepath)

        # Calculate basic statistics
        statistics = calculate_statistics(df)

        # Return the URL to the generated image and statistics
        image_url = request.url_root + output_filepath
        return jsonify({'image_url': image_url, 'statistics': statistics}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def plot_csv(df, graph_type='line', output_filename='graph.png'):
    try:
        if graph_type == 'line':
            df.plot(x=df.columns[0], y=df.columns[1:], kind='line')
        elif graph_type == 'bar':
            df.plot(x=df.columns[0], y=df.columns[1:], kind='bar')
        elif graph_type == 'hist':
            df.plot(y=df.columns[0], kind='hist')
        elif graph_type == 'box':
            df.plot(y=df.columns[1:], kind='box')
        elif graph_type == 'area':
            df.plot(x=df.columns[0], y=df.columns[1:], kind='area')
        elif graph_type == 'pie':
            df[df.columns[1]].plot(kind='pie', labels=df[df.columns[0]], autopct='%1.1f%%')
        else:
            raise ValueError("Unsupported graph type. Supported types are: line, bar, hist, box, area, pie.")
        
        plt.title('Graph')
        plt.xlabel(df.columns[0])
        plt.ylabel('Values')
        plt.legend()

        # Save the plot as an image file
        plt.savefig(output_filename)
        plt.close()
    except Exception as e:
        raise ValueError(f"Error in plotting: {str(e)}")

def calculate_statistics(df):
    statistics = {}
    for column in df.columns[1:]:
        if pd.api.types.is_numeric_dtype(df[column]):
            statistics[column] = {
                'mean': df[column].mean(),
                'median': df[column].median(),
                'mode': df[column].mode().tolist()
            }
    return statistics

if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['STATIC_FOLDER'], exist_ok=True)
    app.run(debug=True)

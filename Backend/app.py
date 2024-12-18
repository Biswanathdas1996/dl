from main.nlq import nlq
from helper.utils import convert_string_to_json, convert_to_json, add_query_to_json
from sql.index import  execute_query
from flask import Flask, request, jsonify, send_file
from gpt.analiticts import getAnalitics, call_gpt
from flask_cors import CORS
from vector_db.vector_db import delete_collection, upload_files, list_collections, search_data
from vector_db.fine_chunking import fine_chunking
import os
from helper.gpt import extract_image
from sql.db import generate_erd_from, execute_sql_query

if __name__ == "__main__":
    
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit
    CORS(app)

    app.config['UPLOAD_FOLDER'] = 'vector_db/uploads'
    app.config['IMG_UPLOAD_FOLDER'] = 'asset/uploads'
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['IMG_UPLOAD_FOLDER'], exist_ok=True)
    @app.before_request
    def before_request():
        custom_header = request.headers.get('X-Ai-Model')
        if custom_header:
          
            os.environ["X-Ai-Model"] = custom_header
            print(f"X-Ai-Model: {custom_header}")

    @app.route('/query-mock', methods=['POST'])
    def query_mock():
        data = request.json
        user_question = data.get('question')
        if not user_question:
            return jsonify({"error": "No question provided"}), 400
        try:
            with open('data/mock/tabuler.json', 'r') as file:
                result_json = file.read()
                print("Mock Result:", result_json)
                return result_json
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/save-query', methods=['POST'])
    def save_query():
        data = request.json
        q_data = data.get('data')
        if not q_data:
            return jsonify({"error": "No question provided"}), 400
        try:
            add_query_to_json(q_data)
            return jsonify({
                "status": "success"
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/query-list', methods=['GET'])
    def get_all_query():
        try:
            with open('query_storage/query.json', 'r') as file:
                result_json = file.read()
                print("Mock Result:", result_json)
                return result_json
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        

    @app.route('/query', methods=['POST'])
    def query():
        data = request.json
        user_question = data.get('question')
        working_table_description = data.get('working_table_description')
        if not user_question:
            return jsonify({"error": "No question provided"}), 400

        try:
            print("User Question:", user_question)
            query = nlq(user_question, working_table_description)
            print("SQL Query:", query)

            # result = execute_query(query)
            # DB_CONFIG = {
            #     'dbname': 'postgres',
            #     'user': 'rittikbasu',
            #     'password': 'Postgres_007',
            #     'host': 'testpgprac.postgres.database.azure.com',
            #     'port': '5432'
            # }
            result = execute_sql_query(query)

         

            # analitics = getAnalitics(result_json)

            return jsonify({
                "result": result,
                "query": query
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        

    @app.route('/analitics', methods=['POST'])
    def analitics_data():
        data = request.json
        result_json = data.get('result_json')
        if not result_json:
            return jsonify({"error": "No data provided"}), 400

        try:
            analitics = getAnalitics(result_json)
            return jsonify({
                "analitics": analitics
            })
           
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        

    @app.route('/analitics-mock', methods=['POST'])
    def analitics_data_mock():
        data = request.json
        result_json = data.get('result_json')
        if not result_json:
            return jsonify({"error": "No data provided"}), 400

        try:
            with open('data/mock/analitics.json', 'r') as file:
                result_json = file.read()
                print("Mock Result:", result_json)
                return result_json
        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route('/exicute-raw-query', methods=['POST'])
    def exicute_query():
        data = request.json
        user_sql_query = data.get('sql_query')
        if not user_sql_query:
            return jsonify({"error": "No question provided"}), 400

        try:
            print("User Question:", user_sql_query)
            
          
            # result = execute_query(user_sql_query)
            result = execute_sql_query(user_sql_query)

            # result_json = convert_to_json(result)

            # analitics = getAnalitics(result_json)

            return jsonify({
                "result": result,
                "query": user_sql_query,
                # "analitics": analitics
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500


# ------------------------------------user story api --------------------------------------------

    @app.route('/call-gpt', methods=['POST'])
    def direct_gpt_call():
        data = request.json
        user_question = data.get('question')
        token_limit = data.get('token_limit')
        if not user_question:
            return jsonify({"error": "No question provided"}), 400
        try:
            if not token_limit:
                token_limit = 1000
            result_json = call_gpt("You are a polite, helping inteligent agent", user_question, token_limit)
            return result_json
        except Exception as e:
            return jsonify({"error": str(e)}), 500


# ------------------------------------file upload --------------------------------------------

# File upload endpoint
@app.route('/upload-collection-doc', methods=['POST'])
def upload_files_data():
    if 'files' not in request.files:
        return "No files provided", 400
    collection_name = request.form.get('collection_name')
    files = request.files.getlist('files')
    try:
        result = upload_files(collection_name, files, app.config['UPLOAD_FOLDER'])
        print("Result:=============>", result)
        return jsonify({"message": result}), 200 
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Search endpoint
@app.route('/search', methods=['POST'])
def search_file_data():
    data = request.get_json()
    query = data.get('query')
    no_of_results = data.get('no_of_results')
    collection_name = data.get('collection_name')
    if_fine_chunking = data.get('fine_chunking')
    if_gpt_summarize = data.get('if_gpt_summarize')
    if not query:
        return jsonify({"error": "No query provided"}), 400       
    if not collection_name:
        return jsonify({"error": "No collection_name provided"}), 400       
    results = search_data(query, collection_name,no_of_results)

    response_result = {"results": results}
  
    ### file chunking ######
    if if_fine_chunking:
        fine_results = fine_chunking(results['documents'],query, 100)
        response_result["fine_results"] = fine_results
       
    if if_gpt_summarize:
        gpt_results = call_gpt("You are an expert summrizer", f"find and list all the key points: \n{results['documents']}", 1000)
        response_result["gpt_results"] = gpt_results
        
    return jsonify(response_result), 200


# Search endpoint
@app.route('/collection', methods=['GET'])
def get_all_collection():
    dlist_collections = list_collections()
    return jsonify({"collections": dlist_collections}), 200


# Search endpoint
@app.route('/collection', methods=['DELETE'])
def remove_collection():
    data = request.get_json()
    collection_name = data.get('collection_name')
    result = delete_collection(collection_name)
    return jsonify({"collections": result}), 200



@app.route('/extract-img', methods=['POST'])
def extract_img_api():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    file_path = os.path.join(app.config['IMG_UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    try:
        img_details = extract_image(file_path)
        return jsonify({"details": img_details}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/generate-erd-from-db', methods=['POST'])
def generate_erd_from_db():
    dbname = request.form.get('dbname')
    user = request.form.get('user')
    password = request.form.get('password')
    host = request.form.get('host')
    port = request.form.get('port')

    if not all([dbname, user, password, host, port]):
        return jsonify({"error": "Missing database configuration parameters"}), 400

    DB_CONFIG = {
        'dbname': dbname,
        'user': user,
        'password': password,
        'host': host,
        'port': port
    }
    # DB_CONFIG = {
    #     'dbname': 'postgres',
    #     'user': 'rittikbasu',
    #     'password': 'Postgres_007',
    #     'host': 'testpgprac.postgres.database.azure.com',
    #     'port': '5432'
    # }
    json_result = generate_erd_from(DB_CONFIG)
    try:
        return json_result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/get-erd-image', methods=['GET'])
def get_erd_img():
    try:
        erd_image_path = 'sql/erd.png'
        return send_file(erd_image_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500








if __name__ == '__main__':
    app.run(debug=True)
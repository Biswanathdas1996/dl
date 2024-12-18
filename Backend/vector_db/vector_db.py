from chromadb import PersistentClient
from chromadb.utils import embedding_functions
from vector_db.chunking import files_processing

client = PersistentClient(path="vector_db/my_vectordb")

# List collections endpoint
def list_collections():
    try:
        collections = client.list_collections()
        collections = [collection.name for collection in collections]
        return collections
    except Exception as e:
        return f"An error occurred while listing collections: {e}"
    

def delete_collection(collection_name):
    try:
        if collection_name in client.list_collections():
            client.delete_collection(collection_name)
            return f"Collection '{collection_name}' deleted successfully."
        else:
            return f"Collection '{collection_name}' does not exist."
    except Exception as e:
        return f"An error occurred while deleting collection: {e}"
    
    
def upload_files(collection_name, files, folder_name):
    try:
        # if collection_name not in client.list_collections():
        try:
            embedding_fn = embedding_functions.ONNXMiniLM_L6_V2()
            print(3)
        except Exception as e:
            print(4)
            return f"An error occurred while initializing the embedding function: {e}"
        collection = client.get_or_create_collection(collection_name,  embedding_function=embedding_fn)
        # else:
        print(1)
        # collection = client.get_collection(collection_name)
        print(2)
        # Use OpenAI embedding functions (or define your own embedding function)
       
        
        try:
            files_data = files_processing(files, folder_name)
            print(5)
        except Exception as e:
            print(6)
            return f"An error occurred while processing files: {e}"
        for file_data in files_data:
            filename = file_data["filename"]
            print(7)

            for text_data in file_data["texts"]:
                try:
                    content = text_data["data"]
                    page_no = text_data["page"]
                    embedding = embedding_fn([content])[0]
                    # Add to ChromaDB with the embedding
                    try:
                        collection.add(
                            ids=[f"{filename}_page_{page_no}"],
                            metadatas=[{"filename": filename, "page_no": page_no}],
                            documents=[content],
                            embeddings=[embedding]
                        ) 
                        print('7.5')
                    except Exception as e:
                        print(8)
                        # return f"An error occurred while adding document to collection: {e}"
                except Exception as e:
                    print(8)
                    # return f"An error occurred while adding document to collection: {e}"
            print(9)
        return f"{len(files)} files uploaded and indexed successfully."
    except Exception as e:
        print(10)
        return f"An error occurred while uploading files: {e}"

def search_data(query, collection_name, no_of_results):
    try:
        collection = client.get_collection(collection_name)
        # Search in ChromaDB
        results = collection.query(
            query_texts=[query],
            n_results=no_of_results,
        )
        return results
    except Exception as e:
        return f"An error occurred while searching data: {e}"

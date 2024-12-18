from sentence_transformers import SentenceTransformer, util
import numpy as np

# Step 1: Initialize the model
model = SentenceTransformer('all-MiniLM-L6-v2')  # You can replace with another model if desired


# Step 3: Chunk the text into smaller parts
def chunk_text(text, max_length=100):
    sentences = text.split('. ')
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_length = len(sentence.split())
        if current_length + sentence_length <= max_length:
            current_chunk.append(sentence)
            current_length += sentence_length
        else:
            chunks.append('. '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
    if current_chunk:
        chunks.append('. '.join(current_chunk))

    return chunks


def fine_chunking(text, query, max_length):
    if isinstance(text, list):
        text = ' '.join([item for sublist in text for item in sublist])
    chunks = chunk_text(text, max_length)

    chunk_embeddings = model.encode(chunks, convert_to_tensor=True)
    query_embedding = model.encode(query, convert_to_tensor=True)

    # Step 6: Perform similarity search
    similarities = util.cos_sim(query_embedding, chunk_embeddings)[0]
    most_similar_idx = np.argmax(similarities.cpu().numpy())

    
    return chunks[most_similar_idx]



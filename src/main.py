import os
import requests
from dotenv import load_dotenv
import services 
import util_llama
import pandas as pd

def main():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('PINECONE_API_KEY')
    index_name = os.getenv('PINECONE_INDEX_NAME')

    # Initialize services
    pinecone_service = services.PineconeService(api_key, index_name)
    
    # Backend processes
    ## Convert PDF ->  [markdown]
    ## pdf_md_converter.py

    ## Parse and select sections from Markdown 
    ## paper_compresser.py    

    ## Save Metadata 
    ## get_metadata.py 

    ## Generate main reaearch questions answered 
    ## question_generation.py

    ## Generate paper cards 
    ## generate_card.py 

    ## Generate gap or future questions 
    ## question_future.py 

    ## Upserting them

#   services.upsert_documents(pinecone_service)

    # FrontEnd
    # Main query interface

    import numpy as np 
    np.random.seed(0)   

    query = "Who is Hezzelin I?"
    ids = []

    try:
        results = util_llama.fetch_and_query(
            pinecone_service, 
            query=query, 
            primary_namespace='llama3-wiki', 
            secondary_namespace='llama3-wiki'
        )
        print(results)
        for card in results[:5]:
            print(f"ID: {card['id_origin']}")
            ids.append(card['id_origin'])
            print("--")

    except ValueError as e:
        print(f"Error: {e}")
    
    data_text = pd.read_json('./data/2wikimqa_e.jsonl', lines=True)
    docs = []
    for id in ids:
        row = data_text[data_text['_id'] == id]
        if not row.empty:
            docs.append(row.iloc[0]['context'])
            print("Document fetched.")
            print("==")
        else:
            print(f"No data found for ID: {id}")
            print("==")


    url = "http://localhost:11434/api/generate"
    prompt = f"Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. context: {docs}\n\n"
    payload = {"model": "llama3:latest", "prompt": f"{prompt} -- Query: {query},", "stream": False}

    try:
        response = requests.post(url, json=payload)
        res = response.json()
        print(res['response'])
        # print(response.json()["response"])
    except Exception as e:
        print(f"Error accessing the response: {e}")

if __name__ == "__main__":
    main()

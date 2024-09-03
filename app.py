import os
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain_community.callbacks import get_openai_callback
from openai import OpenAI
import pandas as pd

app = Flask(__name__)

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Test API Key directly
client = OpenAI(api_key=api_key)
try:
    models = client.models.list()
    print("API Key is valid.")
except Exception as e:
    print(f"Error: {e}")
    raise

def create_vectorstore(text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text=text)

    embeddings = OpenAIEmbeddings(openai_api_key=api_key)
    vectorstore = FAISS.from_texts(chunks, embedding=embeddings)
    return vectorstore

# Global variable to store the VectorStore
VectorStore = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/find_investors', methods=['POST'])
def find_investors():
    global VectorStore

    industry = request.form['industry']
    stage = request.form['stage']
    description = request.form['description']
    location = request.form['location']

    # Load investor data
    investor_file_path = os.path.join(os.path.dirname(__file__), "investors.csv")

    if not os.path.exists(investor_file_path):
        return jsonify({"error": "Investor data file not found."})

    if VectorStore is None:
        df = pd.read_csv(investor_file_path)
        text = "\n".join(df.values.astype(str).flatten())
        VectorStore = create_vectorstore(text)

    prompt = f"""As an AI-powered investor matching system, your task is to analyze the given startup information and provide a list of potential investors who would be most likely to invest in this startup. The startup details are as follows:

Industry: {industry}
Funding Stage: {stage}
Description: {description}
Location: {location}

Based on this information, please provide a list of 5-10 investors who would be the best match for this startup. For each investor, include the following details:
1. Name
2. Investment Focus Areas (if they align with the startup's industry)
3. Preferred Investment Stages
4. Brief explanation of why this investor would be a good match
5. Location
6. Contact details/ any links

When selecting investors, consider the following factors:
1. Industry alignment
2. Stage preference
3. Geographic focus (if any)
4. Investment thesis alignment with the startup's description

Please provide the list in a clear, easy-to-read format. Start directly with the list of investors without any introductory text."""

    docs = VectorStore.similarity_search(query=prompt, k=3)
    llm = ChatOpenAI(model_name="gpt-4-1106-preview")
    chain = load_qa_chain(llm=llm, chain_type="stuff")

    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=prompt)

    return jsonify({"investors": response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
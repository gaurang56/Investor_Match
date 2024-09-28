from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain_community.callbacks import get_openai_callback
from flask_cors import CORS
import os
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

#CORS
CORS(app)

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
    investor_file_path = "investorbase.csv"

    if not os.path.exists(investor_file_path):
        return jsonify({"error": "Investor data file not found."})

    if VectorStore is None:
        df = pd.read_csv(investor_file_path)
        text = "\n".join(df.values.astype(str).flatten())
        VectorStore = create_vectorstore(text)


    startup_details = f"""
    Industry: {industry}
    Funding Stage: {stage}
    Description: {description}
    Location: {location}
    """


    json_structure = """
    {
      "Investor Name": "string",
      "Fund Focus Areas": "string",
      "Location": "string",
      "Contact Details": {
        "Partner Name": "string",
        "Email": "string",
        "Website": "string",
        "Social Links": {
          "Twitter": "string",
          "LinkedIn": "string",
          "Facebook": "string"
        }
      },
      "Likelihood to Invest": "number %",
      "Match Reason": "string"
    }
    """


    prompt = f"""
    As an AI-powered investor matching system, your task is to analyze the given startup information and provide a list of potential investors from the database who are most likely to invest in this startup. The startup details are as follows:

    {startup_details}

    Using the following investor data fields to evaluate matches:
    - Investor Name
    - Fund Type
    - Website (if available)
    - Fund Focus (Sectors)
    - Partner Name
    - Partner Email
    - Location
    - Twitter Link
    - LinkedIn Link
    - Facebook Link

    You will use the following internal fields for context but do not display them to the user:
    - Fund Description
    - Portfolio Companies
    - Number of Investments
    - Number of Exits
    - Preferred Investment Stages

    Evaluate the following key criteria when selecting potential investors:
    1. **Industry alignment**: Ensure that the investor's fund focus (sectors) aligns with the startup's industry and market niche.
    2. **Investment stage**: Match the startup's funding stage with the investor’s preferred fund stage.
    3. **Geographic proximity**: Consider location relevance, favoring investors who are in or focus on regions near the startup's location, but do not exclude global opportunities where geography is not a limiting factor.
    4. **Portfolio companies fit**: If available, assess whether the startup aligns with the types of companies already in the investor’s portfolio (similar markets, technologies, or sectors).
    5. **Investment thesis alignment**: Look at the fund description to ensure that the investor’s philosophy or thesis aligns with the startup’s vision or mission, and explain why this investor would be a strategic match.

    Based on this data, provide a list of **5-10 investors** who would be the best match for this startup. Return the result in the following JSON format for each investor:

    {json_structure}
    
    The match reason should priortize the startup description when matching with an investor.

    

    Please provide the results directly in JSON format without any additional explanations or text before/after it.
    """

    docs = VectorStore.similarity_search(query=prompt, k=3)
    llm = ChatOpenAI(model_name="gpt-4o-mini")
    chain = load_qa_chain(llm=llm, chain_type="stuff")

    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=prompt)

    return jsonify({"investors": response})

if __name__ == '__main__':
    app.run(debug=True)
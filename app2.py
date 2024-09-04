import streamlit as st
from dotenv import load_dotenv
import pickle
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import os
import openai
import pandas as pd

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Test API Key directly
openai.api_key = api_key

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

def main():
    st.set_page_config(page_title="Startup Investor Matcher", page_icon="💼", layout="wide")

    st.title("Startup Investor Matcher")
    st.markdown("Find the perfect investors for your startup!")

    # Sidebar for user inputs
    st.sidebar.header("Startup Information")

    industry = st.sidebar.selectbox(
        "Select Your Industry",
        ["AI/Machine Learning", "FinTech", "HealthTech", "EdTech", "E-commerce", "Other"]
    )

    stage = st.sidebar.selectbox(
        "Select Your Funding Stage",
        ["Seed", "Series A", "Series B", "Series C", "Growth"]
    )

    description = st.sidebar.text_area("Briefly describe your startup")

    location = st.sidebar.text_input("Enter your startup's location")

    # Load investor data
    investor_file_path = "/Users/gaurangdeka/PycharmProjects/InvestorMatch/investors.csv"

    if not os.path.exists(investor_file_path):
        st.error("Investor data file not found.")
        return

    df = pd.read_csv(investor_file_path)
    text = "\n".join(df.values.astype(str).flatten())

    store_name = "investor_database"

    if os.path.exists(f"{store_name}.pkl"):
        with open(f"{store_name}.pkl", "rb") as f:
            VectorStore = pickle.load(f)
    else:
        VectorStore = create_vectorstore(text)
        with open(f"{store_name}.pkl", "wb") as f:
            pickle.dump(VectorStore, f)

    if st.sidebar.button("Find Matching Investors"):
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
        llm = ChatOpenAI(model_name="gpt-4")
        chain = load_qa_chain(llm=llm, chain_type="stuff")

        with st.spinner("Finding the best investor matches for your startup..."):
            with get_openai_callback() as cb:
                response = chain.run(input_documents=docs, question=prompt)

        st.subheader("Potential Investors for Your Startup")
        st.markdown(response)

        st.sidebar.success("Investor matches generated successfully!")

if __name__ == '__main__':
    main()

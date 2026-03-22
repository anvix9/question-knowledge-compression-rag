import os
import re
import json
import requests
import ast
from concurrent.futures import ThreadPoolExecutor, as_completed

# Compile regex once
passage_splitter = re.compile(r'Passage \d+:')

def process_passage(passage, dataset_id, iter_):
    """Processes a single passage and returns its analysis."""
    topics = get_topics(passage)
    questions = get_llama_question(passage, f"{dataset_id}_{iter_}")
    queries = generate_queries(topics, questions) if topics and questions else []

    return {
        "keywords": topics,
        "questions": questions,
        "queries": queries
    }

def get_topics(content):
    """Extract main topics from the paper content using LLaMA."""
    _url = "http://127.0.0.1:11434/api/generate"
    print("Extracting topics...")
    
    _custom_prompt = (
        f"Based on this passage content, identify the main keywords it addresses."
        f"Format the response as a Python list of strings. Example format: '['keyword1', 'keyword2', 'keyword3', 'keyword19', etc..]'."
        f"Content: {content}"
    )
    
    _payload = {
        "model": "llama3",
        "prompt": _custom_prompt,
        "stream": False,
        "options": {"num_ctx": 6000, "temperature": 0.4},
        "keep_alive": -1
    }
    
    try:
        response = requests.post(_url, data=json.dumps(_payload))
        response.raise_for_status()
        response_data = response.json()
        
        # Clean the response to ensure it's a valid Python list
        topics_str = response_data['response'].strip()
        # Remove any markdown formatting if present
        topics_str = re.sub(r'```python|```', '', topics_str).strip()
        # Convert string representation of list to actual list
        print(topics_str)

        result = parse_topics(topics_str)
        return result 

    except Exception as e:
        print(f"Error extracting topics: {str(e)}")
        return ["Topic extraction failed"]


def parse_topics(topics_str):
    # Attempt to extract a bracketed list
    bracketed_list_match = re.search(r'\[.*?\]', topics_str, re.DOTALL)
    if bracketed_list_match:
        list_str = bracketed_list_match.group(0)
        try:
            keywords = ast.literal_eval(list_str)
            return ", ".join(keywords)
        except (SyntaxError, ValueError):
            # If parsing fails, proceed to check other formats
            return list_str 

    keywords = []
    lines = topics_str.split('\n')
    
    for line in lines:
        stripped_line = line.strip()
        # Check for bullet points starting with *
        bullet_match = re.match(r'^\*\s+(.+)$', stripped_line)
        if bullet_match:
            item = bullet_match.group(1).strip()
            keywords.append(item)
            continue
        # Check for numbered items like 1., 4., etc.
        numbered_match = re.match(r'^\d+\.\s+(.+)$', stripped_line)
        if numbered_match:
            item = numbered_match.group(1).strip()
            keywords.append(item)
            continue
    
    return ", ".join(keywords) if keywords else ""

def get_llama_question(section, passage_id):
    """Generate questions based on the section content and theme using LLaMA."""
    _url = "http://127.0.0.1:11434/api/generate"
    print(f"generate questions for {passage_id}...")
    
    _custom_prompt = (
        f"Read the passage carefully and generate all simple questions that this passage can answer."
        f"Generate simple questions in terms of structures, they must not be complex questions."
        f"Generate specific and targeted questions directly, which are complete? The question should have enough context to not be too evasive.Do not generate the same questions."
        f"AVOID this kind of questions: 'What is the overall message conveyed by the text' or 'according to the passage.. .etc.."
        f"For each question, generate two (02) more which are paraphrased ones, and simpler questions that mimic the easy way human look for something through questions."
        f"Format: Q1: question? Q2: question? etc."
        f"Paragraph: {section}"
        )

    _payload = {
        "model": "llama3",
        "prompt": _custom_prompt,
        "stream": False,
        "options": {"num_ctx": 6000, "temperature": 0.3 },
        "keep_alive": -1
    }
    
    try:
        response = requests.post(_url, data=json.dumps(_payload))
        response.raise_for_status()
        response_data = response.json()
        return response_data['response']
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error: {err}")
        return "Error in request or code."

def extract_markdown_sections(file_path, section_titles):
    """Extract specific sections from a markdown file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return {}, ""
    
    # Separate "Abstract" from other titles
    abstract_pattern = r'##\s*Abstract'
    other_titles = [title for title in section_titles if title.lower() != 'abstract']
    
    # Create pattern for numbered sections
    numbered_pattern = r'##\s*(?:\d+\.?\s*)*({titles})'
    other_titles_pattern = '|'.join(map(re.escape, other_titles))
    
    # Combine patterns for both Abstract and numbered sections
    if 'Abstract' in section_titles:
        full_pattern = f'(?:{abstract_pattern}|{numbered_pattern.format(titles=other_titles_pattern)})(.*?)(?=##|\Z)'
    else:
        full_pattern = f'{numbered_pattern.format(titles=other_titles_pattern)}(.*?)(?=##|\Z)'
    
    # Find all matches with case-insensitive flag
    matches = re.finditer(full_pattern, content, re.DOTALL | re.IGNORECASE)
    
    # Store matches in a dictionary with section title as key
    extracted_sections = {}
    for match in matches:
        section_content = match.group(2).strip()
        header = match.group(0).split('\n')[0]
        clean_header = re.sub(r'^##\s*(?:\d+\.?\s*)*', '', header).strip()
        extracted_sections[clean_header] = section_content
    
    return extracted_sections, content

def generate_queries(topics, questions):
    """Generate realistic queries from topics and questions."""
    _url = "http://127.0.0.1:11434/api/generate"
    print("Generating queries...")
    
    _custom_prompt = (
        f"Based on the following topics and questions, generate realistic search queries that someone might use to find related information. "
        f"Topics: {topics}\nQuestions: {questions}\n"
        f"Return ONLY a list of search queries. Example format: ['query1', 'query2', 'query3']."
    )
    
    _payload = {
        "model": "llama3",
        "prompt": _custom_prompt,
        "stream": False,
        "options": {"num_ctx": 6000},
        "keep_alive": -1
    }
    
    try:
        response = requests.post(_url, data=json.dumps(_payload))
        response.raise_for_status()
        response_data = response.json()
        
        # Clean the response to ensure it's a valid Python list
        queries_str = response_data['response'].strip()
        # Remove any markdown formatting if present
        queries_str = re.sub(r'```python|```', '', queries_str).strip()
        # Convert string representation of list to actual list
        print(queries_str)

        match = re.search(r"\[.*?\]", queries_str, re.DOTALL)

        if match:
            list_str = match.group(0)
            # Convert string to actual list
            try:
                keywords = ast.literal_eval(list_str)
                # Join into a comma-separated string
                result = ", ".join(keywords)
                return result 

            except Exception as e:
                print(f"Error in queries extraction:{e}")
                return list_str



    except Exception as e:
        print(f"Error generating queries: {str(e)}")
        return ["Query generation failed"]

def process_jsonl_files(input_file, output_folder, max_workers=8):
    """Process JSONL entries from the input file using parallel passage analysis."""
    os.makedirs(output_folder, exist_ok=True)

    with open(input_file, 'r', encoding="utf-8") as file:
        data_wiki = [json.loads(line) for line in file]

    for item_idx, current_item in enumerate(data_wiki, start=1):
        if item_idx <=50:
            continue
        print(f"Processing {current_item['_id']}... | {item_idx}/{len(data_wiki)}")

        context = current_item.get('context', '')
        passages = passage_splitter.split(context)
        passages = [p.strip() for p in passages if p.strip()]

        complete = {'keywords': [], 'questions': [], 'queries': []}

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_passage = {
                executor.submit(process_passage, p, current_item['dataset'], item_idx): p for p in passages
            }

            for future in as_completed(future_to_passage):
                result = future.result()
                complete['keywords'].append(result['keywords'])
                complete['questions'].append(result['questions'])
                complete['queries'].append(result['queries'])

        output_filename = f"{current_item['dataset']}_{item_idx}_analysis.json"
        output_path = os.path.join(output_folder, output_filename)
        with open(output_path, 'w', encoding='utf-8') as outfile:
            json.dump(complete, outfile, indent=4)

        print(f"Saved analysis for {output_filename} in {output_folder}")


# Example usage
input_file = "./data/2wikimqa_e.jsonl"
output_folder = "./paper_analysis_imp/"
process_jsonl_files(input_file, output_folder)

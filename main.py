from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import nltk
import random
import string
import pandas as pd
import re
from difflib import get_close_matches


def run_chatbot(user_input):
    lemmer = nltk.stem.WordNetLemmatizer()

    # lemmatizes each token in the input list
    def lemTokens(tokens):
        return [lemmer.lemmatize(token) for token in tokens]

    remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)

    # sends text to lower case, strips punctuation, and tokenizes the cleaned text
    def lemNormalize(text):
        return lemTokens(nltk.word_tokenize(text.lower().translate(remove_punct_dict)))

    #
    GREETING_INPUTS = ("hey", "hi", "hello", "what's up")

    GREETINGS_RESPONSES = ["hey", "hi", "hello", "what's up"]

    df = pd.read_csv("team_rankings.csv") # get the dataframe for the stats I am importing
    df.set_index("Team", inplace=True)

    # open the csv file
    with open("team_rankings.csv", "r") as myFile1:
        data1 = myFile1.read() # read the data from the file
        sent_tokens = data1.splitlines() # split data at each line
        

    def filter_teams_by_stats(user_input):
        user_input = user_input.lower()
        
        filters = []
        
        stat_keywords = {
            'strength of schedule': 'SOS',
            'net rating': 'NET',
            'offensive rating': 'offensive rating',
            'defensive rating': 'defensive rating',
            'effective field goal percentage': 'EFG',
            'total shooting percentage': 'TS%',
            'offensive rebounding percentage': 'ORB%',
            'defensive rebounding percentage': 'DRB%',
            'total rebounding percentage': 'TRB%',
            'assist percentage': 'AST%',
            'steal percentage': 'STL%',
            'block percentage': 'BLK%',
            'pace': 'PACE',
            'three point attempt rate': '3PAR',
            'free throw attempt rate': 'FTAR',
            'points per game': 'PPG',
            'field goal percentage': 'FG%',
            'two point field goal percentage': '2FG%',
            'three point field goal percentage': '3FG%',
            'free throw percentage': 'FT%',
            'assists per game': 'APG',
            'assist-to-turnover ratio': 'AST-TOV',
            'points per game allowed': 'Allowed_PPG',
            'field goal percentage allowed': 'Allowed_FG%',
            'two point field goal percentage allowed': '2Point_Allowed_FG%',
            'three point field goal percentage allowed': '3Point_Allowed_FG%',
            'steals per game': 'SPG',
            'blocks per game': 'BPG',
            'fouls per game': 'Fouls',
            'adjusted offensive efficiency': 'ADJOE',
            'adjusted defensive efficiency': 'ADJDE',
            'barthag': 'BARTHAG',
            'wins above bubble': 'WAB',
            'conference': 'CONF',
        }
        
        inverse_stat_keywords = {v.lower(): v for v in stat_keywords.values()}
        stat_keywords.update(inverse_stat_keywords)
        
        sorted_stats = sorted(stat_keywords.keys(), key=lambda x: -len(x))
        escaped_stats = [re.escape(stat) for stat in sorted_stats]
        stat_pattern = '|'.join(escaped_stats)
        
        # First handle the stat filters using regular expressions
        pattern = rf"(?:teams\s+with|where|having|that have)?\s*({stat_pattern})[^0-9<>]*(>=|<=|>|<|greater than|less than|more than|under|over)\s*([0-9\.]+)"
        matches = re.findall(pattern, user_input)
        
        operator_map = {
            'greater than': '>',
            'more than': '>',
            'over': '>',
            'less than': '<',
            'under': '<',
        }
        
        for stat, operator, value in matches:
            operator = operator_map.get(operator, operator)
            match = get_close_matches(stat, stat_keywords.keys(), n=1, cutoff=0.6)
            if match:
                column = stat_keywords[match[0]]
                filters.append((column, operator, float(value))) 
                
        # sort the teams by top whatever number the user enters of whatever stat the user enters
        sort_match = re.search(r"(top\s+(\d+)\s+teams\s+in)\s*([a-zA-Z\s]+)", user_input)
        if sort_match:
            top_n = int(sort_match.group(2))
            stat_requested = sort_match.group(3).strip().lower()
            # Find the stat column
            stat_column = stat_keywords.get(stat_requested)
            if stat_column:
                # Sort the DataFrame based on the requested stat
                sorted_df = df.sort_values(by=stat_column, ascending=False)
                top_teams = sorted_df.head(top_n)
                return f"Top {top_n} teams in {stat_requested}:\n" + "\n".join(top_teams.index.tolist())
            
        # Find the bottom whatever number of teams the user entered for whatever stat
        sort_match = re.search(r"(bottom\s+(\d+)\s+teams\s+in)\s*([a-zA-Z\s]+)", user_input)
        if sort_match:
            bottom_n = int(sort_match.group(2))
            stat_requested = sort_match.group(3).strip().lower()
            
            # gets the stat column
            stat_column = stat_keywords.get(stat_requested)
            if stat_column:
                sorted_df = df.sort_values(by=stat_column, ascending=False)
                bottom_teams = sorted_df.tail(bottom_n)
                return f"bottom {bottom_n} teams in {stat_requested}:\n" + "\n".join(bottom_teams.index.tolist())
                
            
        #conference filter
        conf_match = re.search(r"(?:in|from|conference)\s+(?:the\s+)?([a-zA-Z\s]+?)(?=\s+(that|with|where|having|and|also|which|who)|$)", user_input)
        
        conference = None
        if conf_match:
            conference = conf_match.group(1).strip().upper()
            print(f"Found conference: {conference}")
        
        # If no filters or conference match, return None
        if not filters and not conference:
            return None
        
        filtered_df = df.copy()
        
        # Filter by conference first if a conference was found
        if conference:
            if 'CONF' in filtered_df.columns:
                filtered_df = filtered_df[
                    filtered_df['CONF'].astype(str).str.contains(conference, case=False, na=False)
                ]
                print(f"After filtering by conference '{conference}', rows left: {len(filtered_df)}")
        
        # filter by stats
        for col, op, val in filters:
            if col not in filtered_df.columns:
                return f"Column '{col}' not found in data."
            
            try:
                # Clean % symbols and convert to numeric
                col_data = pd.to_numeric(filtered_df[col].astype(str).str.replace('%', '', regex=False), errors='coerce')
                
                if op == ">":
                    filtered_df = filtered_df[col_data > val]
                elif op == "<":
                    filtered_df = filtered_df[col_data < val]
                elif op == ">=":
                    filtered_df = filtered_df[col_data >= val]
                elif op == "<=":
                    filtered_df = filtered_df[col_data <= val]
                    
                print(f"After filtering {col} {op} {val}, rows left: {len(filtered_df)}")
            except Exception as e:
                return f"Error filtering by '{col}': {e}"
        
        # Handle case where no teams match the filters
        if filtered_df.empty:
            return "No teams matched your filters."
        
        # Return the filtered teams
        return "Teams matching your filters:\n" + "\n".join(filtered_df.index.tolist())
        

    # get the name of the stat and the actual stat connected to the team name
    def get_team_stats(team_name):
        try:
            # exact matching of the team name
            team_stats = df.loc[team_name]
        except KeyError:
            # If exact match fails, try searching for substrings or similar names
            for team in df.index:
                if team_name.lower() in team.lower():  # case-insensitive check
                    team_name = team
                    team_stats = df.loc[team]
                    break
            else:
                return None  # If no match is found
        stats_string = f"Here are the stats for {team_name}:\n"
        for stat, value in team_stats.items():
            stats_string += f"{stat}: {value}\n"
        return stats_string


        
    # greet the user
    def greeting(sentence):
        for word in sentence.split():
            if word.lower() in GREETING_INPUTS:
                return random.choice(GREETINGS_RESPONSES) # randomly choose a greeting

    from sklearn.feature_extraction.text import TfidfVectorizer # type: ignore
    from sklearn.metrics.pairwise import cosine_similarity # type: ignore

    # respond to the user
    def response(user_response):
        
        team_info = get_team_stats(user_response.title())  # Capitalize first letter
        if team_info:
            return team_info
        
        filter_result = filter_teams_by_stats(user_response)
        if filter_result:
            return filter_result
        
        robo_response = ''
        
        # vectorize data into TFIDF
        TfidfVec = TfidfVectorizer(tokenizer=lemNormalize)
        tfidf = TfidfVec.fit_transform(sent_tokens)
        vals = cosine_similarity(tfidf[-1], tfidf) # find cosine similarity 
        idx = vals.argsort()[0][-2]
        flat = vals.flatten()
        flat.sort()
        req_tfidf = flat[-2]
        
        # if there are no matches send this
        if(req_tfidf == 0):
            robo_response=robo_response+"I am sorry I do not understand"  
            return robo_response
        else:
            robo_response = sent_tokens[idx]
            return robo_response
        
    flag=True
        
        
    # continually ask them
    user_response = user_input.strip().lower()

    if user_response in ['bye']:
        return "Data bot: Bye!"
    elif user_response in ['thanks', 'thank you']:
        return "Data bot: You are welcome"
    elif greeting(user_response) is not None:
        return f"Data bot: {greeting(user_response)}"
    else:
        sent_tokens.append(user_response)
        result = response(user_response)
        sent_tokens.remove(user_response)
        return f"Data bot: {result}"
            
            
    return f"Echo: {user_input}"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str
    

@app.post("/chat")
def chat(message: Message):
    response = run_chatbot(message.text)
    return {"response": response}
       
        
    
    
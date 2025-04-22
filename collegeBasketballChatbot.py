# Evan Primasing
# College Basketball Bot that will display all advanced stats for all college basketball teams

import nltk # type: ignore
import random
import string
import pandas as pd # type: ignore

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
print("I am the college basketball bot and I will provide advanced stats for any college basketball team that you input. When you are done say bye!")
    
    
# continually ask them
while(flag ==True):
    user_response = input(">>>").strip() # makes sure any leading or trailing spaces are deleted
    user_response = user_response.lower() # sends the input to lower case
    if(user_response != 'bye'):
        if(user_response=='thanks' or user_response=='thank you'):
            flag=False
            print("Data bot: you are welcome") # if they say thanks or thank you tell them thank you and leave the chat
        else:
            if(greeting(user_response)!= None):
                print("Data Bot: " + greeting(user_response))
            else:
                sent_tokens.append(user_response)
                print("Data bot: ", end="")
                print(response(user_response))
                sent_tokens.remove(user_response)
    else:
        flag = False
        print("Data bot: Bye!") # say bye to them if they say bye
       
        
    
    
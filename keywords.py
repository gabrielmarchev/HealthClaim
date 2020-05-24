import csv
import os
import pandas as pd
import tweepy
import re
import string
from string import punctuation
from textblob import TextBlob
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
#from nltk.sentiment.vader import SentimentIntensityAnalyzer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

import pickle
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer

#tf.compat.v1.disable_v2_behavior()
#keras
#global graph
#global sess
#sess = tf.compat.v1.Session()
#graph = tf.compat.v1.get_default_graph()
#set_session(sess)
#model = tf.keras.models.load_model("/home/gabriel/Sentiment.h5")
MAX_SEQ_LEN = 300

#Twitter credentials for the app
consumer_key = 'fHLwM1mnVIoOZOwkbjLelDF7Z'
consumer_secret = '60oaale7a45EZOmrf0Laa5NMUwagprmDeGOS9wSUDWm52d8TAh'
access_key = '1527972876-Avyofj6USBAKKGpKwo7xqHlnihiCEJn19iKc8U7'
access_secret = '9FK0UIqZZ3u3iiYNsNlNJj7J8jR7su9euaytSUeFqBV2k'

#pass twitter credentials to tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_key, access_secret)
api = tweepy.API(auth, wait_on_rate_limit=True)

#Setup word count vector
health_terms = pd.read_csv("/home/gabriel/HealthClaim/reservedterms.csv")
reserved_terms = health_terms['health term'].tolist()

def process_words(text):
    tokens = nltk.word_tokenize(text)
    tags = nltk.pos_tag(tokens)
    #print(tags)
    verbs = [word for word, pos in tags if (pos == 'VB' or pos == 'VBD' or pos == 'VBG' or pos == 'VBN' or pos == 'VBP' or pos == 'VBZ')]
    #print("verbs")
    #print(verbs)
    adjectives = [word for word, pos in tags if (pos == 'JJ' or pos == 'JJR' or pos == 'JJS')]
    #print("adjectives")
    #print(adjectives)
    pos_tags = ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'JJ', 'JJR', 'JJS']
    #noverbsadj = [word for word, pos in tags if word in reserved_terms else if pos not in pos_tags]
    new_words = []
    for word, pos in tags:
        if word in reserved_terms:
            new_words.append(word)
        else:
            if pos not in pos_tags:
                new_words.append(word)
    new_text = " ".join(new_words)
    
    return new_text

def pre_process(text):
    #lowercase
    text = text.lower()
    
    #remove special chars and digits
    text = re.sub("(\\d|\\W)+"," ",text)
    
    text = process_words(text)
    
    return text

df_idf = pd.read_csv('/home/gabriel/health-claim-data/FoodmaestroData.csv')
df_idf.dtypes
df_idf['text'] = df_idf['Claim'].apply(lambda x: pre_process(x))
docs = df_idf['text'].tolist()
#create vocab of words,
#ignore words that appear in 85% of docs
#eliminate stop words
cv = CountVectorizer(max_df=0.85, stop_words='english')
word_count_vector = cv.fit_transform(docs)
tfidf_transformer = TfidfTransformer(smooth_idf=True,use_idf=True)
tfidf_transformer.fit(word_count_vector)

def sort_coo(coo_matrix):
    tuples = zip(coo_matrix.col, coo_matrix.data)
    return sorted(tuples, key=lambda x: (x[1], x[0]), reverse=True)

def extract_topn_from_vector(feature_names, sorted_items, topn=2):
    #get the feature names and tf-idf score of top n items
    
    #use only topn items from vector
    sorted_items = sorted_items[:topn]

    score_vals = []
    feature_vals = []

    for idx, score in sorted_items:
        fname = feature_names[idx]
        
        #keep track of feature name and its corresponding score
        score_vals.append(round(score, 3))
        feature_vals.append(feature_names[idx])

    #create a tuples of feature,score
    #results = zip(feature_vals,score_vals)
    #results= {}
    #for idx in range(len(feature_vals)):
    #    results[feature_vals[idx]] = score_vals[idx]
    #
    results = []
    for idx in range(len(feature_vals)):
        results.append(feature_vals[idx])
    
    print(results)

    return results

def reserved_term_weights (tfidf, countVec):
    for i in countVec.vocabulary_:
        if i in reserved_terms:
            position = countVec.vocabulary_[i]
            tfidf[:, position] *= 2.0
    
    return tfidf

def extract_keywords(text):
    # you only needs to do this once
    feature_names = cv.get_feature_names()

    # get the document that we want to extract keywords from
    doc = text

    #generate tf-idf for the given document
    tf_idf_vector = tfidf_transformer.transform(cv.transform([doc]))

    #double weights of any present reserved terms
    tf_idf_vector = reserved_term_weights(tf_idf_vector, cv)

    #sort the tf-idf vectors by descending order of scores
    sorted_items = sort_coo(tf_idf_vector.tocoo())

    #extract only the top n; n here is 10
    keywords = extract_topn_from_vector(feature_names,sorted_items,3)
    print("extract")
    print(keywords)

    return keywords

# TWEEPY SEARCH FUNCTION
#@api_view(["GET"])
def analyse(text):
    positive = 0
    neutral = 0
    negative = 0
    tweets1 = []
    tweets2 = []
    #text = request.GET.get("text")
    keywords = extract_keywords(str(text))
    print("keywords")
    print(keywords)

    #first keyword
    
    query1 = "#" + str(keywords[0]) + "-filter:retweets"
    print("query1")
    print(query1)
"""
    for tweet in tweepy.Cursor(api.search,
                                q=query1,
                                count=100,
                                lang="en",
                                tweet_mode="extended"
                                ).items():
        
        with graph.as_default():
            set_session(sess)
            prediction = predict(tweet.full_text)
        if(prediction["label"] == "Positive"):
            positive += 1
        if(prediction["label"] == "Neutral"):
            neutral += 1
        if(prediction["label"] == "Negative"):
            negative += 1
        
        label = predict(tweet.full_text)
        if(label == "Positive"):
            positive += 1
        if(label == "Neutral"):
            neutral += 1
        if(label == "Negative"):
            negative += 1
    
    for tweet in tweepy.Cursor(api.search,q=query1,rpp=5,lang="en", tweet_mode='extended').items(10):
        temp = {}
        temp["text"] = tweet.full_text
        temp["username"] = tweet.user.screen_name
        label = predict(tweet.full_text)
        temp["label"] = label
        tweets1.append(temp)
    
    #second keyword

    query2 = "#" + str(keywords[1]) + "-filter:retweets"
    
    for tweet in tweepy.Cursor(api.search,
                                q=query2,
                                count=100,
                                lang="en",
                                tweet_mode="extended"
                                ).items():
        
        with graph.as_default():
            set_session(sess)
            prediction = predict(tweet.full_text)
        if(prediction["label"] == "Positive"):
            positive += 1
        if(prediction["label"] == "Neutral"):
            neutral += 1
        if(prediction["label"] == "Negative"):
            negative += 1
        
        label = predict(tweet.full_text)
        if(label == "Positive"):
            positive += 1
        if(label == "Neutral"):
            neutral += 1
        if(label == "Negative"):
            negative += 1
        
    for tweet in tweepy.Cursor(api.search,q=query2,rpp=5,lang="en", tweet_mode='extended').items(10):
        temp = {}
        temp["text"] = tweet.full_text
        temp["username"] = tweet.user.screen_name
        label = predict(tweet.full_text)
        temp["label"] = label
        tweets2.append(temp)
    
    first_set = {"keyword": query1, "tweets": tweets1}
    second_set = {"keyword": query2, "tweets": tweets2}

    tweets = {"first": first_set, "second": second_set}

    results = {"positive": positive, "neutral": neutral, "negative": negative}

    return JsonResponse({"results": results, "sampleTweets": tweets})
"""
"""
@api_view(["GET"])
def gettweets(request):
    tweets = []
    query = "#" + request.GET.get("text") + "-filter:retweets"
    for tweet in tweepy.Cursor(api.search,q=query,rpp=5,lang="en", tweet_mode='extended').items(10):
        temp = {}
        temp["text"] = tweet.full_text
        temp["username"] = tweet.user.screen_name
        with graph.as_default():
            set_session(sess)
            prediction = predict(tweet.full_text)
        temp["label"] = prediction["label"]
        temp["score"] = prediction["score"]
        tweets.append(temp)
    return tweets


def buildVocabulary(preprocessedTrainingData):
    all_words = []

    for (words, sentiment) in preprocessedTrainingData:
        all_words.extend(words)

    wordlist = nltk.FreqDist(all_words)
    word_features = wordlist.keys()

    return word_features

def extract_features(tweet):
    tweet_words = set(tweet)
    features = {}
    for word in word_features:
        features['contains(%s)' % word] = (word in tweet_words)
    return features

def main():
    corpus = twitter_search("banana")
    print(*corpus, sep='\n')
    #generate_wordcloud(corpus)
    #tweetProcessor = PreProcessTweets()
    #preprocessedSet = tweetProcessor.processTweets(corpus)
    #print(corpus)
    #print(preprocessedSet)
    
    word_features = buildVocabulary(preprocessedTrainingData)
    trainingFeatures = nltk.classify.apply_features(extract_features, preprocessedTrainingData)

    NBayesClassifier = nltk.NaiveBayesClassifier.train(trainingFeatures)

    NBResultLabels = [NBayesClassifier.classify(extract_features(tweet[0])) for tweet in preprocessedTestSet]

    # get the majority vote
    if NBResultLabels.count('positive') > NBResultLabels.count('negative'):
        print("Overall Positive Sentiment")
        print("Positive Sentiment Percentage = " + str(100*NBResultLabels.count('positive')/len(NBResultLabels)) + "%")
    else:
        print("Overall Negative Sentiment")
        print("Negative Sentiment Percentage = " + str(100*NBResultLabels.count('negative')/len(NBResultLabels)) + "%")
    """

analyse("Protein helps your muscles grow")



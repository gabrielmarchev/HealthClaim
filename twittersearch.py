# -*- coding: utf-8 -*-
"""
Created on Wed Mar  4 22:34:58 2020

@author: Gabriel
"""
import csv
import os
import pandas as pd
import tweepy
#import tweet-preprocessor as preprocessor
import re
import string
from string import punctuation
from textblob import TextBlob
import preprocessor as p
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.sentiment.vader import SentimentIntensityAnalyzer


#Twitter credentials for the app
consumer_key = 'fHLwM1mnVIoOZOwkbjLelDF7Z'
consumer_secret = '60oaale7a45EZOmrf0Laa5NMUwagprmDeGOS9wSUDWm52d8TAh'
access_key= '1527972876-Avyofj6USBAKKGpKwo7xqHlnihiCEJn19iKc8U7'
access_secret = '9FK0UIqZZ3u3iiYNsNlNJj7J8jR7su9euaytSUeFqBV2k'

#pass twitter credentials to tweepy
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_key, access_secret)
api = tweepy.API(auth)

searchTerm = input("enter keyword:")
searchTem = "#" + str(searchTerm) #turn into hashtag
brandName = input("enter brand:")

emoticons_str = r"""
    (?:
        [:=;] # Eyes
        [oO\-]? # Nose (optional)
        [D\)\]\(\]/\\OpP] # Mouth
    )"""

regex_str = [
    emoticons_str,
    r'<[^>]+>', # HTML tags
    r'(?:@[\w_]+)', # @-mentions
    r"(?:\#+[\w_]+[\w\'_\-]*[\w_]+)", # hash-tags
    r'http[s]?://(?:[a-z]|[0-9]|[$-_@.&amp;+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+', # URLs

    r'(?:(?:\d+,?)+(?:\.?\d+)?)', # numbers
    r"(?:[a-z][a-z'\-_]+[a-z])", # words with - and '
    r'(?:[\w_]+)', # other words
    r'(?:\S)' # anything else
]

tokens_re = re.compile(r'('+'|'.join(regex_str)+')', re.VERBOSE | re.IGNORECASE)
emoticon_re = re.compile(r'^'+emoticons_str+'$', re.VERBOSE | re.IGNORECASE)

# Happy Emoticons
emoticons_happy = set([
    ':-)', ':)', ';)', ':o)', ':]', ':3', ':c)', ':>', '=]', '8)', '=)', ':}',
    ':^)', ':-D', ':D', '8-D', '8D', 'x-D', 'xD', 'X-D', 'XD', '=-D', '=D',
    '=-3', '=3', ':-))', ":'-)", ":')", ':*', ':^*', '>:P', ':-P', ':P', 'X-P',
    'x-p', 'xp', 'XP', ':-p', ':p', '=p', ':-b', ':b', '>:)', '>;)', '>:-)',
    '<3'
    ])

# Sad Emoticons
emoticons_sad = set([
    ':L', ':-/', '>:/', ':S', '>:[', ':@', ':-(', ':[', ':-||', '=L', ':<',
    ':-[', ':-<', '=\\', '=/', '>:(', ':(', '>.<', ":'-(", ":'(", ':\\', ':-c',
    ':c', ':{', '>:\\', ';('
    ])

#Emoji patterns
emoji_pattern = re.compile("["
                           u"\U0001F600-\U0001F64F"  # emoticons
                           u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                           u"\U0001F680-\U0001F6FF"  # transport & map symbols
                           u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           u"\U00002702-\U000027B0"
                           u"\U000024C2-\U0001F251"
                           "]+", flags=re.UNICODE)

#combine sad and happy emoticons
emoticons = emoticons_happy.union(emoticons_sad)


#below is from github
"""
def tokenize(s):
    return tokens_re.findall(s)

def preprocess(s, lowercase=False):
    tokens = tokenize(s)
    if lowercase:
        tokens = [token if emoticon_re.search(token) else token.lower() for token in tokens]
    print(tokens)
    return tokens

def moreProcess(corpus):
    punctuatian = list(string.punctuation)
    count_all = Counter()
    stop = stopwords.words('english') + punctuation + ['rt', 'retweet', '...','th','via']
    corpus=str.lower(corpus)

    #just words (no hashtags, no mentions)
    terms_only = [term for term in preprocess(corpus)
                if term not in stop and
                not term.startswith(('#', '@'))]
                #startswith takes tuple, not list
    count_all.update(terms_only)
"""


def clean_tweets(tweet):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(tweet)

    #after tweepy preprocessing the colon left remain after removing mentions
    #or RT sign in the beginning of the tweet
    tweet = re.sub(r':', '', tweet)
    tweet = re.sub(r'‚Ä¶', '', tweet)
    #replace consecutive non-ASCII characters with a space
    tweet = re.sub(r'[^\x00-\x7F]+',' ', tweet)


    #remove emojis from tweet
    tweet = emoji_pattern.sub(r'', tweet)

    #filter using NLTK library append it to a string
    filtered_tweet = [w for w in word_tokens if not w in stop_words]
    filtered_tweet = []

    #looping through conditions
    for w in word_tokens:
        #check tokens against stop words , emoticons and punctuations
        if w not in stop_words and w not in emoticons and w not in string.punctuation:
            filtered_tweet.append(w)
    return ' '.join(filtered_tweet)
    #print(word_tokens)
    #print(filtered_sentence)

def cleanTweet(text):
    clean_text = p.clean(text)
    filtered_text = clean_tweets(clean_text)
    return filtered_text

# TWEEPY SEARCH FUNCTION
def tw_search(api):
    counter = 0
    # Open/Create a file to append data
    csvFile = open('result.csv','w',newline='')
    #Use csv Writer
    csvWriter = csv.writer(csvFile)

    csvWriter.writerow(["created", "original tweet", "clean text", "hashtag", "positive", "negative", "neutral", "compound"])
    corpus= []
    for tweet in tweepy.Cursor(api.search,
                                q = searchTerm,
                                lang = "en",
                                count = 100).items():
        #TWEET INFO
        created = tweet.created_at   #tweet created
        text = tweet.text            #tweet text
        tweet_id = tweet.id          #tweet ID# (not author ID#)
        try:
            hashtag = tweet.entities[u'hashtags'][0][u'text'] #hashtags used
        except:
            hashtag = "None"

        clean_text = cleanTweet(text)

        print(clean_text + '\n')

        corpus.append(clean_text)

        #pass textBlob method for sentiment calculations
        blob = TextBlob(clean_text)
        Sentiment = blob.sentiment

        #seperate polarity and subjectivity in to two variables
        #polarity = Sentiment.polarity
        sid = SentimentIntensityAnalyzer()
        polarity = sid.polarity_scores(clean_text)
        print(str(polarity) + '\n')
        #print('\n')

        try:
            csvWriter.writerow([created, str(text), str(clean_text), hashtag, polarity['pos'], polarity['neg'], polarity['neu'], polarity['compound']])
            counter = counter + 1
            if (counter == 100):
                break
        except:
            pass

    csvFile.close()
    return corpus

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
    corpus = tw_search(api)
    print(*corpus, sep='\n')
    #generate_wordcloud(corpus)
    #tweetProcessor = PreProcessTweets()
    #preprocessedSet = tweetProcessor.processTweets(corpus)
    #print(corpus)
    #print(preprocessedSet)
    """
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
main()

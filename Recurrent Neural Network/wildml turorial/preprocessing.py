import nltk 
import csv
import itertools
import numpy as np


unknown_token = "UNKNOWN_TOKEN"
sentence_start_token = "SENTENCE_START"
sentence_end_token   = "SENTENCE_END"

def preprocess_data(vocabulary_size):
    print("Reading the CSV file...")
    with open('data/reddit-comments-2015-08.csv', 'rt') as f:
        reader = csv.reader(f, skipinitialspace=True)
        next(reader)
        # split full comments into sentences 
        sentences = itertools.chain(*[nltk.sent_tokenize(x[0].lower()) for x in reader])
        # append START end END
        sentences = ["%s %s %s" % (sentence_start_token, s, sentence_end_token) for s in sentences]  

    print("Parsed %d sentences." % (len(sentences)))

    # Tokenize the sentences into words
    tokenized_sentences = [nltk.word_tokenize(sent) for sent in sentences]

    # Count the word frequencies 
    word_freq = nltk.FreqDist(itertools.chain(*tokenized_sentences))
    print("Found %d unique words tokens." % len(word_freq.items()))

    # Get the most common words and build index_to_word and word_to_index vectors
    vocab = word_freq.most_common(vocabulary_size - 1)
    index_to_word = [x[0] for x in vocab]
    index_to_word.append(unknown_token)
    # index_to_word.append(sentence_start_token)
    # index_to_word.append(sentence_end_token)
    word_to_index = dict([(w,i) for i,w in enumerate(index_to_word)])

    print('Using vocabulary size %d.' % vocabulary_size)
    print('The least frequent word in our vocabulary is "%s" and it appeared %d times.' % (vocab[-1][0], vocab[-1][1]))

    # Replace all words not in our vocabulary with the unknown token
    for i, sent in enumerate(tokenized_sentences):
        tokenized_sentences[i] = [w if w in word_to_index else unknown_token for w in sent]

    print('\nExample Sentence: "%s"' % sentences[0])
    print('Example Sentence after pre-processing: "%s"' % tokenized_sentences[0])

    # Creating the training data
    X_train = np.asarray([[word_to_index[w] for w in sent[:-1]] for sent in tokenized_sentences])
    Y_train = np.asarray([[word_to_index[w] for w in sent[1:]] for sent in tokenized_sentences])
    return X_train, Y_train, word_to_index, index_to_word
from preprocessing import *
from theano_model import RNNTheano
from pathlib import Path 
from utils import *
import datetime 
import sys 

def train(model, X_train, y_train, learning_rate=0.005, nepoch=100, evaluate_loss_after=5):
    # keep track of losses so we can plot them 
    losses = []
    num_examples_seen = 0
    for epoch in range(nepoch):
        loss = model.calculate_loss(X_train, y_train)
        losses.append((num_examples_seen, loss))
        time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print('%s: Loss after num_examples=%d epoch=%d: %f' % (time, num_examples_seen, epoch, loss))
        # adjusting the learning rate if loss increases 
        if (len(losses) > 1 and losses[-1][1] > losses[-2][1]):
            learning_rate = learning_rate * .5
            print("Setting learning rate to %f" % learning_rate)
        sys.stdout.flush()
        for i in range(len(y_train)):
            model.sgd_step(X_train[i], y_train[i], learning_rate)
            num_examples_seen += 1

def generate_sentences(model):
    new_sentence = [WTI[sentence_start_token]]
    # repeat until we got an end token
    k = 0
    while not new_sentence[-1] == WTI[sentence_end_token] or k == 15:
        next_word_probs = model.forward_propagation(new_sentence)
        sampled_word = WTI[unknown_token]
        # We dont want to sample unknown words 
        # print(len(next_word_probs))
        while sampled_word == WTI[unknown_token]:
            samples = np.random.multinomial(1, next_word_probs[-1])
            sampled_word = np.argmax(samples)
        new_sentence.append(sampled_word)
    sentence_str = [ITW[x] for x in new_sentence[1:-1]]
    return sentence_str


vocabulary_size = 8000
X, Y, WTI, ITW = None, None, None, None  

# save_data('./data/save.npz', 1, 2)
if Path('./data/saved.npz').is_file():
    X, Y, ITW = load_data('./data/saved.npz')
    WTI = dict([(w,i) for i,w in enumerate(ITW)])
    print('Data loaded %d' % len(X))
else:
    X, Y, WTI, ITW = preprocess_data(vocabulary_size)
    save_data('./data/saved.npz', X, Y, ITW)

thanos = RNNTheano(vocabulary_size)
if Path('./data/thanos.npz').is_file():
    load_model_parameters_theano('./data/thanos.npz', thanos)

else: 
    train(thanos, X[:100], Y[:100], nepoch=10, evaluate_loss_after=1)
    save_model_parameters_theano('./data/thanos.npz', thanos)

# generate some text ! 
num_sentences = 10 
senten_min_length = 7 
for i in range(num_sentences):
    sent = [] 
    # to get longer sentences ! 
    while len(sent) < senten_min_length:
        sent = generate_sentences(thanos)
    print(" ".join(sent))

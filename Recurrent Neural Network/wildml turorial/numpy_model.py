import numpy as np
import operator
from utils import softmax

class RNN_numpy: # word_dim = size of vocabulary
    def __init__ (self, word_dim, hidden_dim = 100, bptt_trancate=4):
        self.word_dim = word_dim
        self.hidden_dim = hidden_dim
        self.bptt_trancate = bptt_trancate
        # Randomly initialize the network params
        self.U = np.random.uniform(-np.sqrt(1./word_dim), np.sqrt(1./word_dim), (hidden_dim, word_dim))
        self.V = np.random.uniform(-np.sqrt(1./hidden_dim), np.sqrt(1./hidden_dim), (word_dim, hidden_dim))
        self.W = np.random.uniform(-np.sqrt(1./hidden_dim), np.sqrt(1./hidden_dim), (hidden_dim, hidden_dim))


    def forward_propagation(self, x):
        # tot num of time steps
        T = len(x)
        # during FP we save all hidden states in s cuz we need them later!
        # we add one additional element for the initial hidden, = 0
        s = np.zeros((T + 1, self.hidden_dim))
        s[-1] = np.zeros(self.hidden_dim) # the last element
        # outputs at each time step, 
        o = np.zeros((T, self.word_dim))
        for t in np.arange(T):
            # Note that we are indexing U by x[t]. This is the same as multi U with a one-hot vector
            s[t] = np.tanh(self.U[:,x[t]] + self.W.dot(s[t - 1]))
            o[t] = softmax(self.V.dot(s[t]))
        return [o, s]

    def predict(self, x):
        # perform FP and return index of the highest score
        o, s = self.forward_propagation(x)
        return np.argmax(o, axis=1)

    def calculate_total_loss(self, x, y):
        L = 0
        # for each sentence
        for i in np.arange(len(y)):
            o, s = self.forward_propagation(x[i])
            correct_word_predictions = o[np.arange(len(y[i])), y[i]]
            L += -1 * np.sum(np.log(correct_word_predictions))
        return L 
    # L(y, o) = -1/N * sum(y_n, log(o_n))
    def calculate_loss(self, x, y):
        N = np.sum((len(y_i) for y_i in y))
        return self.calculate_total_loss(x, y) / N 
    
    def backpropagation_through_time(self, x, y):
        T = len(x)
        # perform forward propagation
        o, s = self.forward_propagation(x)
        # accumulate the gradients 
        dU = np.zeros(self.U.shape)
        dV = np.zeros(self.V.shape)
        dW = np.zeros(self.W.shape)

        delta_o = o 
        delta_o[np.arange(len(y)), y] -= 1
        #for each output backwards
        for t in np.arange(T)[::-1]:
            dV += np.outer(delta_o[t], s[t].T)
            delta_t = self.V.T.dot(delta_o[t]) * (1 - (s[t] ** 2))
            # backprob thru time
            for bptt_step in np.arange(max(0, t-self.bptt_trancate), t+1)[::-1]:
                dW += np.outer(delta_t, s[bptt_step-1])
                dU[:,x[bptt_step]] += delta_t
                # update delta for next step 
                delta_t = self.W.T.dot(delta_t) * (1 - s[bptt_step] ** 2)
        return [dU, dV, dW]
    
    def gradient_check(self, x, y, h=0.001, error_threshold=0.01):
        gradients = self.backpropagation_through_time(x, y)
        model_params = ['U', 'V', 'W']

        for i, n in enumerate(model_params):
            parameter = operator.attrgetter(n)(self)
            print("Performing gradient check for parameter %s with size %d." % (n, np.prod(parameter.shape)))
            # itr over each element of the param matrix, e.g. (0,0), (0,1), ...
            it = np.nditer(parameter, flags=['multi_index'], op_flags=['readwrite'])
            while not it.finished:
                ix = it.multi_index
                # store it for later
                original_value = parameter[ix]
                # estimate gradient using (f(x+h) - f(x-h))/(2*h)
                parameter[ix] = original_value + h
                gradplus = self.calculate_total_loss([x], [y])
                parameter[ix] = original_value - h 
                gradminus = self.calculate_total_loss([x], [y])
                estimated_gradient = (gradplus - gradminus) / (2*h)
                # reset param
                parameter[ix] = original_value
                # gradient for this param using backprob
                backprop_gradient = gradients[i][ix]
                # calc relative error : (|x - y|) / (|x| + |y|)
                relative_error = np.abs(backprop_gradient - estimated_gradient) / (np.abs(backprop_gradient) + np.abs(estimated_gradient))
                if relative_error > error_threshold:
                    print("Gradient check ERROR: parameter=%s ix=%s" % (n, ix))
                    print("+h loss: %f" % gradplus)
                    print("-h loss: %f" % gradminus)
                    print("Estimated gradient: %f" % estimated_gradient)
                    print("backprop gradient: %f" % backprop_gradient)
                    print("Relative error: %f" % relative_error)
                    return
                it.iternext() 
            print("Gradient check for parameter %s passed." % (n))

        # To avoid performing millions of expensive calculations we use a smaller vocabulary size for checking.
        # grad_check_vocab_size = 100
        # np.random.seed(10)
        # model = RNNNumpy(grad_check_vocab_size, 10, bptt_truncate=1000)
        # model.gradient_check([0,1,2,3], [1,2,3,4])

    def sgd_step(self, x, y, learning_rate):
        dU, dV, dW = self.backpropagation_through_time(x, y)
        self.U -= learning_rate * dU 
        self.V -= learning_rate * dV 
        self.W -= learning_rate * dW 
class NeuralNetwork{
    constructor(inputs, hidden, outputs, d){
        if(inputs instanceof tf.Sequential){
            this.model = inputs;
            this.inputNodes = hidden;
            this.hiddenNodes = outputs;
            this.outputsNodes = d;
        }else{
            this.inputNodes = inputs;
            this.hiddenNodes = hidden;
            this.outputsNodes = outputs;
            this.model =  this.createModel();
        }
    }
    mutate(rate){
        tf.tidy(()=>{
        const weights = this.model.getWeights();    
        const mutatedWeights = []
        for (let i = 0; i < weights.length; i++) {
            let tensor = weights[i];
            let shape = weights[i].shape;
            let values = tensor.dataSync().slice();
            for (let j = 0; j < values.length; j++) {
                if(random(1) < rate){
                    let actualWeight = values[j];
                    values[j] = actualWeight + randomGaussian();
                }   
            }
            let newTensor = tf.tensor(values, shape);
            mutatedWeights[i] = newTensor;
        }
        this.model.setWeights(mutatedWeights)
        })   
    }

    copy(){
       return tf.tidy(()=>{
        const modelCopy = this.createModel();
        const newWeights = this.model.getWeights();
        const weightCopies = [];
        for (let i = 0; i < newWeights.length; i++) {
            weightCopies[i] = newWeights[i].clone()
        }
        modelCopy.setWeights(weightCopies);
        return new NeuralNetwork(
            modelCopy, 
            this.inputNodes,
            this.hiddenNodes, 
            this.outputsNodes
        );})       
    }
    dispose(){
        this.model.dispose()
    }
    predict(inputs){
       return tf.tidy(()=>{
        const xs = tf.tensor2d([inputs])
        const ys = this.model.predict(xs);
        const outputs = ys.dataSync();
        return outputs;
        })  
    }
    createModel(){
        const model = tf.sequential();
        const hiddenLayer = tf.layers.dense({
            units: this.hiddenNodes,
            inputShape: [this.inputNodes],
            activation: 'sigmoid'
        })

        model.add(hiddenLayer);
        const outputLayer = tf.layers.dense({
            units: this.outputsNodes,
            activation: 'softmax'
        })
        model.add(outputLayer)
        return model;
    }
}
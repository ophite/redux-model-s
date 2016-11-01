'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var apiReducer = exports.apiReducer = function apiReducer(state, action) {
    if (!action.payload) {
        return state;
    }
    var model = action.payload.model;

    if (!model) {
        return state;
    }

    if (!Object.keys(state).length) {
        throw 'No models in state';
    }

    if (!model.MODEL_NAME) {
        throw 'No MODEL_NAME in model';
    }

    if (!~Object.keys(state).indexOf(model.MODEL_NAME)) {
        return state;
    }

    var reduceMethod = model.getReduceMethod(model, action.type);
    if (reduceMethod) {
        return model.reduce(state, action, reduceMethod);
    }

    // here can be added custom reducers
    switch (action.type) {
        default:
            return state;
    }
};
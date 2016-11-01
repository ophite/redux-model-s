'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var model = function () {

    //region init

    function model() {
        _classCallCheck(this, model);
    }

    _createClass(model, null, [{
        key: 'create',
        value: function create() {
            return {
                isLoading: false
            };
        }
    }, {
        key: 'handleServerResponse',


        //endregion

        //region api

        value: function handleServerResponse(dispatch, params, model, serverResponse) {
            var modelClient = model.toClient(serverResponse);
            dispatch(model.dispatchModel({ modelClient: modelClient, model: model }));
        }
    }, {
        key: 'apiCall',
        value: function apiCall(requestMethod, model) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var modelApiMethod = arguments[3];
            var failAction = arguments[4];


            return function (dispatch) {
                var fail = failAction ? failAction(dispatch) : function (error) {
                    throw error;
                };

                dispatch(model.dispatchRequest({ model: model }));
                return modelApiMethod(requestMethod, params).then(function (serverResponse) {
                    model.handleServerResponse(dispatch, params, model, serverResponse);
                }).catch(fail);
            };
        }
    }, {
        key: 'apiGet',
        value: function apiGet() {
            throw 'Not implemented method (apiGet)';
        }
    }, {
        key: 'apiPost',
        value: function apiPost() {
            throw 'Not implemented method (apiPost)';
        }
    }, {
        key: 'toClient',


        //endregion

        //region convert

        value: function toClient() {
            return {};
        }
    }, {
        key: 'toServer',
        value: function toServer() {
            return {};
        }

        //endregion

        //region dispatch

    }, {
        key: 'dispatchRequest',
        value: function dispatchRequest() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var model = params.model;

            return {
                type: model.TYPE_REQUEST,
                payload: params
            };
        }
    }, {
        key: 'dispatchModel',
        value: function dispatchModel() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var model = params.model;

            return {
                type: model.TYPE_FROM_SERVER,
                payload: params
            };
        }
    }, {
        key: 'dispatchClear',
        value: function dispatchClear() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var model = params.model;

            return {
                type: model.TYPE_CLEAR,
                payload: params
            };
        }
    }, {
        key: 'actionGet',


        //endregion

        //region action

        value: function actionGet(requestMethod, model, failAction) {
            var _this = this;

            return function () {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return _this.apiCall(requestMethod, model, params, model.apiGet.bind(model), failAction);
            };
        }
    }, {
        key: 'actionPost',
        value: function actionPost(requestMethod, model, failAction) {
            var _this2 = this;

            return function () {
                var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                return _this2.apiCall(requestMethod, model, params, model.apiPost.bind(model), failAction);
            };
        }
    }, {
        key: 'actionClear',
        value: function actionClear(model) {
            return function () {
                return function (dispatch) {
                    dispatch(model.dispatchClear({ model: model }));
                };
            };
        }
    }, {
        key: 'getReduceMethod',


        //endregion

        //region reducer

        value: function getReduceMethod(model, type) {
            var _reducers;

            var reducers = (_reducers = {}, _defineProperty(_reducers, model.TYPE_REQUEST, model.reduceRequest), _defineProperty(_reducers, model.TYPE_FROM_SERVER, model.reduceGet), _defineProperty(_reducers, model.TYPE_CLEAR, model.reduceClear), _reducers);

            return reducers[type];
        }
    }, {
        key: 'reduce',
        value: function reduce(state, action, reduceMethod) {
            var model = action.payload.model;

            var stateModel = state[model.MODEL_NAME];

            return _extends({}, state, reduceMethod(stateModel, action, state));
        }
    }, {
        key: 'reduceRequest',
        value: function reduceRequest(stateModel, action, state) {
            var model = action.payload.model;

            return _defineProperty({}, model.MODEL_NAME, _extends({}, stateModel, {
                isLoading: true
            }));
        }
    }, {
        key: 'reduceGet',
        value: function reduceGet(stateModel, action, state) {
            var _action$payload = action.payload,
                model = _action$payload.model,
                modelClient = _action$payload.modelClient;

            return _defineProperty({}, model.MODEL_NAME, _extends({}, modelClient, {
                isLoading: false
            }));
        }
    }, {
        key: 'reduceClear',
        value: function reduceClear(stateModel, action, state) {
            var model = action.payload.model;

            return _defineProperty({}, model.MODEL_NAME, _extends({}, model.create()));
        }
    }]);

    return model;
}();

model.MODEL_NAME = '';
model.TYPE_REQUEST = '';
model.TYPE_FROM_SERVER = '';
model.TYPE_CLEAR = '';
exports.default = model;
# Redux-models. OOP style. [![npm version](https://img.shields.io/npm/v/redux-model-s.svg?style=flat-square)](https://www.npmjs.com/package/redux-model-s) [![Medium](https://img.shields.io/badge/blog-medium-brightgreen.svg)](https://medium.com/@kobernikyura/redux-models-oop-style-8ffb56d0098a#.fishkkfyg)

### Background
This approach can be usefull in big projects with a lot of REST Full API. When your application consists of dozens of screens and dozens or much bigger server endpoints for getting data this is not comfortable for me to has a lot of files for developing one business model (API file for send request, action creator, action type, reducer and mapper). Even more when you see that all cases can be the group in similar behavior logic, some things can be reused you start annoying doing monkey works.
I decided to invent some way that helps me to improve this process. Now I tell a little bit about my small concept with using model in the react-redux application.
I have decided to move all data logic in models. All data operations, all manipulations will be in one place its Model! It will be used class inheritance for save most common logic in a base model. And in this way you can you all advantage of OOP. You can create base classes, you can write once and use everywhere in sub classes.
In this first approach I placed in base model 3 reducers and action creators: start requesting, get a response from the server and clear data when you need this. In such easy way, we covered some base demand for REST API in client-side. Of course, you have in almost every data some custom behavior — this can be handle with a sub model, where can be overridden any method or add new ones (action creators, action types, reducers or mappers).
All API requests (get, post, put, delete) also live in the model, every model knows from where it can get and how to convert it request params from component to server and request response from the server to the client.
Redux stay working and you can use it as before for some custom situations. But all that can be placed in model concept you can move to models.

#### Goals
- Move all logic (action creator, api call, reducer, data transformations server-client-server, validation) in one file - MODEL
- Write once used everywhere. It's OOP style - when you base models and sub models. Can all advantages from OOP.
- Reduce code, reduce dynamic objects calling
- No dependencies
- [Cross-platform](#platform-support) - can be used in React-Native

### Installation
#### Using npm:
```sh
$ npm install --save react-model-s
```
#### Using yarn:
```sh
$ yarn add react-model-s
```
### Usage
```javascript
/**
 * pokemon.model.js
 */
import model from 'redux-model-s/lib/models/base.model';
import urls from '../constants/urls.constant';
import { isEmpty } from '../utils/helper';


class pokemonsModel extends model {

    static MODEL_NAME = 'pokemonsModel';
    static TYPE_REQUEST = 'REQUEST_POKEMONS';
    static TYPE_FROM_SERVER = 'GET_POKEMONS';
    static TYPE_CLEAR = 'CLEAR_POKEMONS';

    constructor(props) {
        super(props);
    };

    static apiGet(requestMethod, params = {}) {
        const { limit, offset } = this.toServer(params);
        const url = urls.pokeball.getPokemons();
        const queryParams = (offset !== undefined)
            ? { limit, offset: (offset + limit) }
            : { limit };

        return requestMethod(url, {}, queryParams);
    };

    static create() {
        const props = super.create();
        return {
            ...props,
            items: [],
            isFirstLoading: false,
            paginator: {},
            hasMore: false
        };
    };

    static toClient(serverModel) {
        if (!serverModel) {
            return this.create();
        }

        const { meta, objects } = serverModel;
        const paginator = this.toClientPaginator(meta);
        const items = objects
            .map((pokemon) => ({
                id: pokemon.pkdx_id,
                name: pokemon.name,
                // avatar: `http://pokeapi.co/media/img/${pokemon.pkdx_id}.png`,
                avatar: `https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/sprites/pokemon/model/${pokemon.pkdx_id}.png`,
                types: pokemon.types
            }));

        return {
            items,
            paginator
        };
    };

    static toClientPaginator(serverModel) {
        const paginator = {
            limit: serverModel.limit,
            next: serverModel.next,
            offset: serverModel.offset,
            previous: serverModel.previous,
            total_count: serverModel.total_count
        };

        return paginator;
    };

    static toServer(params) {
        if (isEmpty(params)) {
            return {};
        }

        return {
            limit: params.limit,
            offset: params.offset,
        };
    }

    static reduceGet(stateModel, action) {
        const { modelClient, model } = action.payload;
        const { items: _items } = stateModel;
        const { items, paginator } = modelClient;

        return {
            [model.MODEL_NAME]: {
                items: [..._items, ...items],
                paginator,
                hasMore: paginator.offset < paginator.total_count,
                isLoading: false,
                isFirstLoading: false
            }
        };
    };

    static reduceRequest(stateModel, action, state) {
        const { model } = action.payload;
        const newState = super.reduceRequest(stateModel, action, state)[model.MODEL_NAME];
        const { items, isLoading } = newState;

        return {
            [model.MODEL_NAME]: {
                ...stateModel,
                isFirstLoading: isLoading && (!items || !items.length)
            }
        };
    };
}

export {
    pokemonsModel,
};
```

### Advanced Usage
You can fill reducers with any model

```js
/**
 * pokemon.reducer.js
 */
import { apiReducer } from 'redux-model-s/lib/reducers/api.reducer';
import { pokemonModel } from '../models/pokemon.model';
import { pokemonsModel } from '../models/pokemons.model';

const DEFAULT_STATE = {
    [pokemonModel.MODEL_NAME]: pokemonModel.create(),
    [pokemonsModel.MODEL_NAME]: pokemonsModel.create(),
};

export default (state = DEFAULT_STATE, action) => {
    return apiReducer(state, action);
};
```

### Examples
The source includes [example](/examples) that should help you get started. 

### Questions?
If you have any questions, please submit an Issue with the "[question](https://github.com/ophite/redux-model-s/issues)"

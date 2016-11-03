# Redux-models. OOP style. [![npm version](https://img.shields.io/npm/v/redux-model-s.svg?style=flat-square)](https://www.npmjs.com/package/redux-model-s) [![Medium](https://img.shields.io/badge/blog-medium-brightgreen.svg)](https://medium.com/@kobernikyura/redux-models-oop-style-8ffb56d0098a#.fishkkfyg)

### Background
In this approach you have only model with all the logic (getting data from server, converting it into client view, action creators, reducers etc …) and standard redux reducer for linking your model with reducer:

#### Goals
- Move all logic (action creator, api call, reducer, data transformations server-client-server, validation) in one file - MODEL
- Write once used everywhere. It's OOP style - when you base models and sub models. Can all advantages from OOP.
- Reduce code, reduce dynamic objects calling
- No dependencies
- [Cross-platform](#platform-support) - can be used in React-Native

### Installation
#### Using npm:
```sh
$ npm install --save redux-model-s
```
#### Using yarn:
```sh
$ yarn add redux-model-s
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

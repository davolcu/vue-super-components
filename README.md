# vue-super-components

[![version](https://img.shields.io/npm/v/vue-super-components.svg)](https://www.npmjs.com/package/vue-super-components)
[![install-size](https://packagephobia.now.sh/badge?p=vue-super-components)](https://packagephobia.now.sh/result?p=vue-super-components)
[![license](https://img.shields.io/npm/l/vue-super-components.svg)](https://github.com/bonavida/vue-super-components/blob/master/LICENSE)

## Overview

`vue-super-components` Is a library to add inheritance mechanisms to Vue Components. The library will automatically add all the props, data, methods, etc. from the parent component which are not defined on the child component. The library will also add a `$parent` attribute to the child component where all the props, data, methods, etc. from the parent which are overwritten in the child, are placed

## Instalation

```sh
npm install vue-super-components
```

or

```sh
yarn add vue-super-components
```

## Usage

### Initialization

- Download the package: `npm install vue-super-components`

- Import the library on your Vue components as follows:

```js
import { SuperComponent } from 'vue-super-components';
```

- From here, if you're using the SFC pattern, import the component which is supposed to be the parent component and instead of default exporting the Vue component as you would do, assign it to a constant, and default export as follows:

```js
import ParentComponennt from 'path/to/ParentComponent.vue';

const ChildComponent = { name: 'ChildComponent' };
export default SuperComponent(ChildComponent, ParentComponent);
```

- Optionally you could also pass a configuration object for some extra settings, such as an extra array of attributes you want to ignore from the parent

```js
export default SuperComponent(ChildComponent, ParentComponent, { ignoredAttributes: ['name', 'props'] });
```

### Default ignored attributes

By default, all the Vue attributes which starts with the `_` character are ignored, because they're suppossed to be private. Also the `render`, `staticRenderFns` attributes are ignored

### Configuration file

You may want to ignore some extra attributes during the inheritance process. Maybe for some cases, you want to ignore a certain attribute, for these scenarios you can add the `ignoredAttributes` property to the configuration file:

| Property            | Description |
| ------------------- | ----------- |
| ignoredAttributes   | This property must be an array. It could include one or more Vue Attributes. For instance: `{ ignoredAttributes: ['name', 'props', 'data'] }` |

## Examples

### Example 1

In this example I'll cover the setter and boolean getters.
Let's say we have this component:

```js
export default {
    name: 'BroComponent',
    data() {
        return {
            name: '',
            surname: '',
            friends: [],
        }
    },
};
```

This is a pretty straightforward component, which manages the `name`, `surname` and the list of `friends` of a Bro. Now if you would like to use this component, you probably would like to set these data props, check if they have value different than an empty string, check if the array has any elements, etc. For all of these cases you would probably have to create methods such as `setName` or `hasFriends`, to handle events properly or render HTML or not.

That's what VuePopulator does for you, automatically. You would write just a couple of extra lines as follows:

```js
import { VuePopulator } from 'vue-template-populator';

export default {
    name: 'BroComponent',
    data() {
        return {
            name: '',
            surname: '',
            friends: [],
        }
    },
    created() {
        VuePopulator(this);
    },
};
```

And the library will automatically create the following methods for you to use them:

```js
setName(name = '') {
    this.name = name;
},

setSurname(surname = '') {
    this.surname = surname;
},

setFriends(friends = []) {
    this.friends = friends;
},
```

It also will create the following computed for you:

```js
hasName() {
    return !!this.name;
},

hasSurname() {
    return !!this.surname;
},

hasFriends() {
    return !!this.friends.length;
},
```

Quite cool and easy to use huh!

```js
import { VuePopulator } from 'vue-template-populator';

export default {
    name: 'BroComponent',
    data() {
        return {
            name: '',
            surname: '',
            friends: [],
        }
    },
    created() {
        VuePopulator(this);
        
        console.log(this.hasName);
        // false
        
        this.setName('davolcu');
        console.log(this.name, this.hasName);
        // "davolcu", true
    },
};
```

### Example 2

In this second example, I'll show you the quick-access getter. 

#### Example 2.1

To get a more realistic use-case, let's say we have a component which gets the data in an async way, from a `getData` method imported from a `services` layer file:

```js
import { getData } from 'services.js';

export default {
    name: 'BroComponent',
    data() {
        return {
            bro: null,
        }
    },
    methods: {
        // Get the data for the component
        fetchData() {
            // Do async request
            getData().then((response) => {
                this.bro = { ...response.data }
            });
        }
    },
    created() {
        this.fetchData();
    },
};
```

Again, this is an straightforward scenario, a component which gets the data from an API, so we don't know the structure `bro` will have. For instance, let's assume that `response.data` will have the following structure: `{ name: 'dav', surname: 'olcu', friends: [] }`. As I've mentioned before, you can call the populator in any moment, so let's call it right after the response assignation:

```js
import { VuePopulator } from 'vue-template-populator';
import { getData } from 'services.js';

export default {
    name: 'BroComponent',
    data() {
        return {
            bro: null,
        }
    },
    methods: {
        // Get the data for the component
        fetchData() {
            // Do async request
            getData().then((response) => {
                this.bro = { ...response.data }
                VuePopulator(this);
            });
        }
    },
    created() {
        this.fetchData();
    },
};
```

As I've already explained, the `setBro` method, and the `hasBro` computed will be created. But as `bro` is an object, some quick-access computed getters will be created too, actually there'll be one for each property of the object. So in this case the following computed getters will be created:

- `broName`: Quick-access to `bro.name`.
- `broSurname`: Quick-access to `bro.surname`.
- `broFriends`: Quick-access to `bro.friends`.

```js
.
.
.
methods: {
    // Get the data for the component
    fetchData() {
        // Do async request
        getData().then((response) => {
            this.bro = { ...response.data }
            VuePopulator(this);
            
            console.log(this.broName, this.broSurname)
            // "dav", "olcu"
        });
    }
},
.
.
.
```

#### Example 2.2

Not only that, if any of the properties of any object is actually another object, the same process will be applied, resulting on an infinite nesting quick-access system. So, given the same scenario, let's assume `response.data` this time is `{ metadata: { name: 'dav', surname: { first: 'ol', last: 'cu' }}, friends: [] }`. Then, the following will be created:

- `broMetadataName`: Quick-access to `bro.metadata.name`.
- `broMetadataSurnameFirst`: Quick-access to `bro.metadata.surname.first`.
- `broMetadataSurnameLast`: Quick-access to `bro.metadata.surname.last`.
- `broFriends`: Quick-access to `bro.friends`.

```js
.
.
.
methods: {
    // Get the data for the component
    fetchData() {
        // Do async request
        getData().then((response) => {
            this.bro = { ...response.data }
            VuePopulator(this);
            
            console.log(this.broMetadataName, this.broMetadataSurnameLast)
            // "dav", "cu"
        });
    }
},
.
.
.
```

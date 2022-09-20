# vue-super-components

[![version](https://img.shields.io/npm/v/vue-super-components.svg)](https://www.npmjs.com/package/vue-super-components)
[![install-size](https://packagephobia.now.sh/badge?p=vue-super-components)](https://packagephobia.now.sh/result?p=vue-super-components)
[![license](https://img.shields.io/npm/l/vue-super-components.svg)](https://github.com/davolcu/vue-super-components/blob/master/LICENSE)

## Overview

`vue-super-components` Is a library to add inheritance mechanisms to Vue Components. The library will automatically add all the props, data, methods, etc. from the parent component which are not defined on the child component. The library will also add a `$super` attribute to the child component where all the props, data, methods, etc. from the parent which are overwritten in the child, are placed.

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

-   Download the package: `npm install vue-super-components`

-   Import the library on your Vue components as follows:

```js
import { SuperComponent } from 'vue-super-components';
```

-   From here, if you're using the SFC pattern, import the component which is supposed to be the parent component and instead of default exporting the Vue component as you would do, assign it to a constant, and default export as follows:

```js
import ParentComponennt from 'path/to/ParentComponent.vue';

const ChildComponent = { name: 'ChildComponent' };
export default SuperComponent(ChildComponent, ParentComponent);
```

-   Optionally you could also pass a configuration object for some extra settings, such as an extra array of attributes you want to ignore from the parent.

```js
export default SuperComponent(ChildComponent, ParentComponent, { ignoredAttributes: ['name', 'props'] });
```

### Default ignored attributes

By default, all the Vue attributes which starts with the `_` character are ignored, because they're suppossed to be private. Also the `render`, `staticRenderFns` attributes are ignored by default.

### Configuration file

You may want to ignore some extra attributes during the inheritance process. Maybe for some cases, you want to ignore a certain attribute, for these scenarios you can add the `ignoredAttributes` property to the configuration file:

| Property          | Description                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ignoredAttributes | This property must be an array. It could include one or more Vue Attributes. For instance: `{ ignoredAttributes: ['name', 'props', 'data'] }` |

## Examples

### Example 1

In this example I'll cover a simple inheritance process.
Let's say we have this component as ParentComponent:

```js
export default {
    name: 'ParentComponent',
    data() {
        return {
            name: '',
            surname: '',
        };
    },
    computed: {
        // Get the name
        parentName() {
            return this.name;
        },

        // Get the surname
        parentSurname() {
            return this.surname;
        },
    },
};
```

This is a pretty straightforward component, which manages the `name`, `surname`. Now if you would like to extend this component, you probably would either move the code to a external object or to a mixin, which will do the trick, but is not real inheritance.

That's what SuperComponent does for you, automatically. You would write just a couple of extra lines as follows:

```js
import { SuperComponent } from 'vue-super-components';
import ParentComponent from 'path/to/ParentComponent.vue';

const ChildComponent = {
    name: 'ChildComponent',
};

export default SuperComponent(ChildComponent, ParentComponent);
```

And the library will automatically add the `data()` and the computeds defined in the parent, to the child. Also, as said, this process will create an attribute `$super` on the ChildComponent, which will be an object containing the `name` attribute of its parent.

Quite cool and easy to use huh!

### Example 2

In this second example, I'll show you the overload feature. In other programming languages, which do have native inheritance, one of the most important features is the method overload. This means that you should be able to define a method in the child, which extends the functionality of the same method defined in the parent.

`vue-super-components` runs at build time. This means that you can use the overloading (`$super`) when coding the child component, even though the child component doesn't know yet that will be extended.

#### Example 2.1

To get a more realistic use-case, let's say we have a component which has a `name` and a `surname` as data props, and a method which returns the whole name as a formatted string:

```js
export default {
    name: 'ParentComponent',
    data() {
        return {
            name: 'Dav',
            surname: 'Olcu',
        };
    },
    methods: {
        // Gets the formatted name
        getFormattedName() {
            return `${this.name} ${this.surname}`;
        },
    },
};
```

Now let's say we have another component, which will do exactly the same, but will also receive a prefix as a prop. As said, we could make this second component to extend from the previous one, and overload the `getFormattedName` as follows:

```js
import { SuperComponent } from 'vue-super-components';
import ParentComponent from 'path/to/ParentComponent.vue';

const ChildComponent = {
    name: 'ChildComponent',
    props: {
        prefix: {
            type: String,
            default: 'Sir',
        },
    },
    methods: {
        // Gets the formatted name plus the prefix
        getFormattedName() {
            return `${this.prefix} ${this.$super.getFormattedName()}`;
        },
    },
};

export default SuperComponent(ChildComponent, ParentComponent);
```

Since we're defining the exact same method on this ChildComponent, the `$super` attribute will be created, containing the originial method from the parent.

#### Example 2.2

Not only that, all the attributes can be extended. So, for instance, if instead of having a prop for the prefix we would like to have it as a data prop, we could extend the `data()` function from the parent, as it just returns an object. As follows:

```js
import { SuperComponent } from 'vue-super-components';
import ParentComponent from 'path/to/ParentComponent.vue';

const ChildComponent = {
    name: 'ChildComponent',
    data() {
        return {
            ...this.$super.data(),
            prefix: 'Sir',
        };
    },
    methods: {
        // Gets the formatted name plus the prefix
        getFormattedName() {
            return `${this.prefix} ${this.$super.getFormattedName()}`;
        },
    },
};

export default SuperComponent(ChildComponent, ParentComponent);
```

Again, since we're defining the `data()` on the child component, the original data function from the parent will be included in the `$super` attribute.

### Example 2.3

The same way, we could overwrite any prop or data prop on the child by simply extending the original attribute. So, for instance, if we want the ChildComponent to have a different `name` we could just overload the parent's data function. As follows:

```js
import { SuperComponent } from 'vue-super-components';
import ParentComponent from 'path/to/ParentComponent.vue';

const ChildComponent = {
    name: 'ChildComponent',
    data() {
        return {
            ...this.$super.data(),
            prefix: 'Sir',
            name: 'NotDav',
        };
    },
    methods: {
        // Gets the formatted name plus the prefix
        getFormattedName() {
            return `${this.prefix} ${this.$super.getFormattedName()}`;
        },
    },
};

export default SuperComponent(ChildComponent, ParentComponent);
```

### Example 3

Last but not least, as explained on the `Configuration` section, by adding the `ignoredAttributes`, we could define a list of attributes we don't want to extend.

Say we have the same parent component, but now it also includes a `mounted` function which triggers on every mount LCH:

```js
export default {
    name: 'ParentComponent',
    data() {
        return {
            name: 'Dav',
            surname: 'Olcu',
        };
    },
    methods: {
        // Gets the formatted name
        getFormattedName() {
            return `${this.name} ${this.surname}`;
        },
    },
    mounted() {
        // Do something
    },
};
```

And let's say we want the child to be stateless, so we don't want to execute that `mounted` at all. Then we could exclude it through the `ignoredAttributes`:

```js
import { SuperComponent } from 'vue-super-components';
import ParentComponent from 'path/to/ParentComponent.vue';

const ChildComponent = {
    name: 'ChildComponent',
};

export default SuperComponent(ChildComponent, ParentComponent, { ignoredAttributes: ['mounted'] });
```

Obviously, this is not a common scenario, but it could be used to exclude mixins, props or any other attribute on more specific scenarios.

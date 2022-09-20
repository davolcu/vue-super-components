// Custom imports
import { constants } from './constants.js';

/**
 * Checks if the type of the attribute is an Object
 * @param {String} type
 */
const isObject = (type) => {
    return type === constants.OBJECT_TYPE;
};

/**
 * Checks if the type of the attribute is an Array
 * @param {String} type
 */
const isArray = (value, type) => {
    return isObject(type) && Array.isArray(value);
};

/**
 * Filters out the attributes that should be ignored from the list
 * @param {Array} attributes
 * @param {Object} config
 */
export const getFilteredAttributes = (attributes, config) => {
    const { ignoredAttributes = [] } = config ?? {};

    return attributes.filter((attribute) => {
        if (ignoredAttributes.includes(attribute)) {
            return false;
        }

        if (constants.IGNORED_ATTRIBUTES.includes(attribute)) {
            return false;
        }

        return !attribute.startsWith('_');
    });
};

/**
 * Populates the attribute to the component
 * @param {Object} component
 * @param {Any} value
 * @param {String} attribute
 */
export const populateAttribute = (component, value, attribute) => {
    const childValue = component[attribute];
    const childType = typeof childValue;
    const type = typeof value;

    // If the parent object in the child component doesn't exist then create it
    if (!component.$super) {
        component.$super = {};
    }

    // Check the object fields to run a deep copy process
    if (isObject(type)) {
        if (!isObject(childType)) {
            Object.entries(value).forEach(([key, entryValue]) => {
                component.$super[key] = entryValue;
            });
            return;
        }

        Object.entries(value).forEach(([key, entryValue]) => {
            if (childValue[key]) {
                component.$super[key] = entryValue;
                return;
            }

            childValue[key] = entryValue;
        });
        return;
    }

    // Check the arrays to run an array merge if both fields are arrays
    if (isArray(type)) {
        component.$super[attribute] = [...value];

        if (isArray(childType)) {
            component[attribute] = [...value, ...childValue];
        }

        return;
    }

    // On the rest of the cases simply save the value onto the parent object
    component.$super[attribute] = value;
};

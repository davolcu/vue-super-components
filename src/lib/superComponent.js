// Custom imports
import { getFilteredAttributes, populateAttribute } from './utils.js';

const superComponent = (child, parent, config) => {
    const component = { ...child };
    const attributes = getFilteredAttributes(Object.keys(parent), config);

    attributes.forEach((attribute) => {
        const value = parent[attribute];

        if (!component[attribute]) {
            component[attribute] = value;
            return;
        }

        populateAttribute(component, value, attribute);
    });

    return component;
};

export default superComponent;

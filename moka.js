var Moka = {};

/**
 * Instantiate.
 */
Moka.Instantiate = function (component, container, state) {

    if (container != undefined && container.constructor == Object) {
        state = container;
        container = undefined;
    }

    component = Moka.Cache.take(component, state);

    if (container !== undefined) {
        container.empty();
        container.append(component.render());
    }

    return component;
};

/**
 * Component.
 */
Moka.Component = function (name, initialState, render) {
    this.onRender = render.bind(this);
    this.name = name;

    $.extend(true, this, initialState);
};

Moka.Component.prototype = {
    constructor: Moka.Component,

    render: function () {
        var options = $.extend({
            inherits: 'div',
            children: null,
            className: ''
        }, this.onRender());

        if (Moka.Cache.equals(options.inherits, this)) {
            console.error("Cannot render recursive component: " + this.name);
            return;
        }

        this.children = options.children;
        this.className = options.className;

        this.element = this._getBase(options.inherits);
        this._setChildren(options.children);
        this.element.addClass(options.className);

        // these options shouldn't matter anymore.
        delete options.inherits;
        delete options.children;
        delete options.className;

        this._setAttributes(options);

        return this.element;
    },

    /**
     * Updates the view re-rendering and updating the DOM element.
     */
    update: function () {
        var oldElement = this.element;
        this.render();
        oldElement.replaceWith(this.element);
    },

    /**
     * Replaces the current render method. Automatically updates the widget.
     *
     * @param render    the new render method.
     */
    setRender: function (render) {
        this.onRender = render;
        this.update();
    },

    _getChild: function (child) {
        if (child instanceof Moka.Component) {
            return child.render();
        }

        return child;
    },

    _setChildren: function (children) {
        if (children != undefined) {
            if (Array.isArray(children)) {

                for (var i = 0; i < children.length; i++) {
                    this.element.append(this._getChild(children[i]));
                }
            } else {
                this.element.append(this._getChild(children));
            }
        }
    },

    _setAttributes: function (options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (typeof options[key] == 'function') {

                    var action = key.replace('on', '');
                    action = action[0].toLowerCase() + action.substr(1, action.length - 1);

                    this.element.on(action, options[key]);
                } else {
                    this.element.attr(key, options[key]);
                }
            }
        }
    },

    _getBase: function (inherits) {
        if (Moka.Cache.has(inherits)) {
            var component = Moka.Cache.take(inherits);
            return component.render();
        } if (inherits[0] == '#') {
            var base = $(inherits);

            if (base == undefined) {
                console.error("Cannot inherit from undefined element " + inherits);
            }

            return base.clone();
        } else {
            return $('<' + inherits +  '>');
        }
    }
};

/**
 * Component Cache.
 */
Moka.Cache = {
    components: {},

    define: function (name, state, render) {
        this.components[name] = {
            initialState: state,
            render: render
        };
    },

    getModel: function (name) {
        return this.components[name];
    },

    has: function (name) {
        return this.components.hasOwnProperty(name);
    },

    take: function (name, state) {
        var model = this.getModel(name);

        var initialState = model.initialState;

        if (state != undefined) {
            initialState = $.extend(true, {}, model.initialState);
            $.extend(true, initialState, state);
        }

        return new Moka.Component(name, initialState, model.render);
    },

    equals: function (name, component) {
        return name === component.name;
    }
};

/**
 * Factory methods.
 */
Moka.Factory = {
    input: function (name) {
        Moka.Cache.define(name, {
            type: 'text',
            value: undefined,

            onInput: function (e) {
                this.value = e.target.value;
            }
        }, function () {
            return {
                inherits: 'input',
                type: this.type,
                placeholder: this.placeholder,
                onInput: this.onInput,
                value: this.value
            }
        });
    },

    button: function (name) {
        Moka.Cache.define(name, {
            text: '',
            className: undefined
        }, function () {
            return {
                inherits: 'button',
                children: this.text,
                className: this.className,
                onClick: this.onClick
            }
        });
    },

    anyStatic: function (name, inherits, options) {
        Moka.Cache.define(name, {
            text: '',
            className: undefined,
            children: undefined
        }, function () {
            var defaultOptions = {
                inherits: inherits,
                children: this.children,
                className: ''
            };

            $.extend(defaultOptions, options);

            return defaultOptions;
        });
    }
};

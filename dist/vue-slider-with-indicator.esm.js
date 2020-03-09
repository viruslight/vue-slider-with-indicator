//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  name: 'VueSliderWithIndicator',
  data: function data () {
    return {
      settings: {
        init: 50,
        max: 100,
        min: 0,
        step: 1,
        vertical: false,
        direction: 'ltr',
        sliderWidth: this.sliderWidth,
        sliderHeight: '50px',
        backgroundColor: 'black',
        handleWidth: '50px',
        handleHeight: '50px',
        handleColor: '#4CAF50',
        indicatorWidth: '5px',
        indicatorHeight: '50px',
        indicatorColor: 'rgba(255, 136, 0, 0.7)'
      }
    }
  },
  props: {
    sliderValue: Number,
    indicatorValue: Number,
    options: Object
  },
  computed: {
    calculatedSliderValue: {
      get: function get () {
        var valueOrDefault =
          this.sliderValue === 'undefined'
          ? this.settings.init
          : this.sliderValue;
        return valueOrDefault
      },
      set: function set (val) {
        this.$emit('input', val);
      }
    },
    // Setting up CSS variables from the values of the style object.
    // Necessary because pseudo elements like the handle can't be
    // accessed inline.
    containerStyle: function containerStyle () {
      var transformOrigin = null;
      var rotation = null;
      if (this.settings.vertical) {
        var sliderWidth = this.settings.sliderWidth;
        var widthValue = sliderWidth.match(/\d+/g)[0];
        var widthUnit = sliderWidth.slice(sliderWidth.match(/\d+/g)[0].length);
        transformOrigin = (widthValue / 2 + widthUnit) + " " + (widthValue / 2 + widthUnit);
        rotation = 'rotate(-90deg)';
      }

      return {
        '--sliderWidth': this.settings.sliderWidth,
        '--sliderHeight': this.settings.sliderHeight,
        '--backgroundColor': this.settings.backgroundColor,
        '--transformOrigin': transformOrigin,
        '--rotation': rotation,
        '--direction': this.settings.direction
      }
    },
    sliderStyle: function sliderStyle () {
      return {
        '--handleWidth': this.settings.handleWidth,
        '--handleHeight': this.settings.handleHeight,
        '--handleColor': this.settings.handleColor
      }
    },
    indicatorStyle: function indicatorStyle () {
      return {
        '--indicatorWidth': this.settings.indicatorWidth,
        '--indicatorHeight': this.settings.indicatorHeight,
        '--indicatorColor': this.settings.indicatorColor
      }
    }
  },
  watch: {
    options: function (to, from) {
      // Oldschool loop because buble (ES5 transpiler) doesn't like for...of
      var settingsList = Object.keys(to);
      for (var i = 0; i < settingsList.length; i++) {
        var currentSetting = settingsList[i];
        this.settings[currentSetting] = to[currentSetting];
      }

      // Use this if buble can do it at some point
      // for (const option of Object.keys(to)) {
      //   this.settings[option] = to[option]
      // }
    }
  },
  mounted: function mounted () {

    if (isNaN(this.sliderValue)) {
      console.error(("Expected Number for 'sliderValue', instead got " + (this.sliderValue) + "."));
    }
    if (isNaN(this.indicatorValue)) {
      console.error(("Expected Number for 'indicatorValue', instead got " + (this.indicatorValue) + "."));
    }

    if (this.options) {
      for (var opt in this.options) {
        if (opt !== 'style') {
          this.settings[opt] = this.options[opt];
        }
      }
      // If sliderHeight is set, make handle and indicator take up full height
      if (Object.keys(this.options).includes('sliderHeight')) {
        this.settings.handleHeight = this.options['sliderHeight'];
        this.settings.indicatorHeight = this.options['sliderHeight'];
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "slider-container", style: _vm.containerStyle },
    [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.calculatedSliderValue,
            expression: "calculatedSliderValue"
          }
        ],
        staticClass: "slider synth-slider",
        style: _vm.sliderStyle,
        attrs: {
          type: "range",
          max: _vm.settings.max,
          min: _vm.settings.min,
          step: _vm.settings.step
        },
        domProps: { value: _vm.calculatedSliderValue },
        on: {
          __r: function($event) {
            _vm.calculatedSliderValue = $event.target.value;
          }
        }
      }),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.indicatorValue,
            expression: "indicatorValue"
          }
        ],
        staticClass: "slider modulation-indicator",
        style: _vm.indicatorStyle,
        attrs: {
          type: "range",
          max: _vm.settings.max,
          min: _vm.settings.min,
          step: _vm.settings.step
        },
        domProps: { value: _vm.indicatorValue },
        on: {
          __r: function($event) {
            _vm.indicatorValue = $event.target.value;
          }
        }
      })
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-88c1ade8_0", { source: "\n.slider-container[data-v-88c1ade8] {\n  position: relative;\n  width: var(--sliderWidth);\n  height: var(--sliderHeight);\n}\n\n/* From:\nhttps://www.w3schools.com/howto/howto_js_rangeslider.asp */\n.slider[data-v-88c1ade8] {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 100%;\n  background-color: var(--backgroundColor);\n  transform-origin: var(--transformOrigin);\n  transform: var(--rotation);\n  direction: var(--direction);\n}\n.synth-slider[data-v-88c1ade8]::-webkit-slider-thumb {\n  -webkit-appearance: none; /* Override default look */\n  appearance: none;\n  width: var(--handleWidth); /* Set a specific slider handle width */\n  height: var(--handleHeight); /* Slider handle height */\n  background-color: var(--handleColor); /* Green background */\n  border: none;\n  border-radius: 0;\n  cursor: pointer; /* Cursor on hover */\n}\n.synth-slider[data-v-88c1ade8]::-moz-range-thumb {\n  width: var(--handleWidth); /* Set a specific slider handle width */\n  height: var(--handleHeight); /* Slider handle height */\n  background-color: var(--handleColor); /* Green background */\n  border: none;\n  border-radius: 0;\n  cursor: pointer; /* Cursor on hover */\n}\n.modulation-indicator[data-v-88c1ade8] {\n  position: absolute;\n  background: none;\n  pointer-events: none;\n  top: 0;\n}\n.modulation-indicator[data-v-88c1ade8]::-webkit-slider-thumb {\n  -webkit-appearance: none; /* Override default look */\n  appearance: none;\n  width: var(--indicatorWidth); /* Set a specific slider handle width */\n  height: var(--indicatorHeight); /* Slider handle height */\n  background-color: var(--indicatorColor);\n  border: none;\n  border-radius: 0;\n}\n.modulation-indicator[data-v-88c1ade8]::-moz-range-thumb {\n  width: var(--indicatorWidth); /* Set a specific slider handle width */\n  height: var(--indicatorHeight); /* Slider handle height */\n  background: var(--indicatorColor);\n  border: none;\n  border-radius: 0;\n}\n\n", map: {"version":3,"sources":["D:\\projects\\npm\\VueSliderWithIndicator\\src\\VueSliderWithIndicator.vue"],"names":[],"mappings":";AAiJA;EACA,kBAAA;EACA,yBAAA;EACA,2BAAA;AACA;;AAEA;0DACA;AACA;EACA,wBAAA;EACA,gBAAA;EACA,WAAA;EACA,YAAA;EACA,wCAAA;EACA,wCAAA;EACA,0BAAA;EACA,2BAAA;AACA;AAEA;EACA,wBAAA,EAAA,0BAAA;EACA,gBAAA;EACA,yBAAA,EAAA,uCAAA;EACA,2BAAA,EAAA,yBAAA;EACA,oCAAA,EAAA,qBAAA;EACA,YAAA;EACA,gBAAA;EACA,eAAA,EAAA,oBAAA;AACA;AAEA;EACA,yBAAA,EAAA,uCAAA;EACA,2BAAA,EAAA,yBAAA;EACA,oCAAA,EAAA,qBAAA;EACA,YAAA;EACA,gBAAA;EACA,eAAA,EAAA,oBAAA;AACA;AAEA;EACA,kBAAA;EACA,gBAAA;EACA,oBAAA;EACA,MAAA;AACA;AAEA;EACA,wBAAA,EAAA,0BAAA;EACA,gBAAA;EACA,4BAAA,EAAA,uCAAA;EACA,8BAAA,EAAA,yBAAA;EACA,uCAAA;EACA,YAAA;EACA,gBAAA;AACA;AAEA;EACA,4BAAA,EAAA,uCAAA;EACA,8BAAA,EAAA,yBAAA;EACA,iCAAA;EACA,YAAA;EACA,gBAAA;AACA","file":"VueSliderWithIndicator.vue","sourcesContent":["<template>\n  <div class=\"slider-container\" :style=\"containerStyle\">\n    <input\n      type=\"range\"\n      class=\"slider synth-slider\"\n      :style=\"sliderStyle\"\n      :max=\"settings.max\"\n      :min=\"settings.min\"\n      :step=\"settings.step\"\n      v-model=\"calculatedSliderValue\"\n    >\n    <input\n      type=\"range\"\n      class=\"slider modulation-indicator\"\n      :style=\"indicatorStyle\"\n      :max=\"settings.max\"\n      :min=\"settings.min\"\n      :step=\"settings.step\"\n      v-model=\"indicatorValue\"\n    >\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'VueSliderWithIndicator',\n  data () {\n    return {\n      settings: {\n        init: 50,\n        max: 100,\n        min: 0,\n        step: 1,\n        vertical: false,\n        direction: 'ltr',\n        sliderWidth: this.sliderWidth,\n        sliderHeight: '50px',\n        backgroundColor: 'black',\n        handleWidth: '50px',\n        handleHeight: '50px',\n        handleColor: '#4CAF50',\n        indicatorWidth: '5px',\n        indicatorHeight: '50px',\n        indicatorColor: 'rgba(255, 136, 0, 0.7)'\n      }\n    }\n  },\n  props: {\n    sliderValue: Number,\n    indicatorValue: Number,\n    options: Object\n  },\n  computed: {\n    calculatedSliderValue: {\n      get () {\n        const valueOrDefault =\n          this.sliderValue === 'undefined'\n          ? this.settings.init\n          : this.sliderValue\n        return valueOrDefault\n      },\n      set (val) {\n        this.$emit('input', val)\n      }\n    },\n    // Setting up CSS variables from the values of the style object.\n    // Necessary because pseudo elements like the handle can't be\n    // accessed inline.\n    containerStyle () {\n      let transformOrigin = null\n      let rotation = null\n      if (this.settings.vertical) {\n        const sliderWidth = this.settings.sliderWidth\n        const widthValue = sliderWidth.match(/\\d+/g)[0]\n        const widthUnit = sliderWidth.slice(sliderWidth.match(/\\d+/g)[0].length)\n        transformOrigin = `${widthValue / 2 + widthUnit} ${widthValue / 2 + widthUnit}`\n        rotation = 'rotate(-90deg)'\n      }\n\n      return {\n        '--sliderWidth': this.settings.sliderWidth,\n        '--sliderHeight': this.settings.sliderHeight,\n        '--backgroundColor': this.settings.backgroundColor,\n        '--transformOrigin': transformOrigin,\n        '--rotation': rotation,\n        '--direction': this.settings.direction\n      }\n    },\n    sliderStyle () {\n      return {\n        '--handleWidth': this.settings.handleWidth,\n        '--handleHeight': this.settings.handleHeight,\n        '--handleColor': this.settings.handleColor\n      }\n    },\n    indicatorStyle () {\n      return {\n        '--indicatorWidth': this.settings.indicatorWidth,\n        '--indicatorHeight': this.settings.indicatorHeight,\n        '--indicatorColor': this.settings.indicatorColor\n      }\n    }\n  },\n  watch: {\n    options: function (to, from) {\n      // Oldschool loop because buble (ES5 transpiler) doesn't like for...of\n      const settingsList = Object.keys(to)\n      for (let i = 0; i < settingsList.length; i++) {\n        const currentSetting = settingsList[i]\n        this.settings[currentSetting] = to[currentSetting]\n      }\n\n      // Use this if buble can do it at some point\n      // for (const option of Object.keys(to)) {\n      //   this.settings[option] = to[option]\n      // }\n    }\n  },\n  mounted () {\n\n    if (isNaN(this.sliderValue)) {\n      console.error(`Expected Number for 'sliderValue', instead got ${this.sliderValue}.`)\n    }\n    if (isNaN(this.indicatorValue)) {\n      console.error(`Expected Number for 'indicatorValue', instead got ${this.indicatorValue}.`)\n    }\n\n    if (this.options) {\n      for (let opt in this.options) {\n        if (opt !== 'style') {\n          this.settings[opt] = this.options[opt]\n        }\n      }\n      // If sliderHeight is set, make handle and indicator take up full height\n      if (Object.keys(this.options).includes('sliderHeight')) {\n        this.settings.handleHeight = this.options['sliderHeight']\n        this.settings.indicatorHeight = this.options['sliderHeight']\n      }\n    }\n  }\n}\n</script>\n\n<!-- Add \"scoped\" attribute to limit CSS to this component only -->\n<style scoped>\n.slider-container {\n  position: relative;\n  width: var(--sliderWidth);\n  height: var(--sliderHeight);\n}\n\n/* From:\nhttps://www.w3schools.com/howto/howto_js_rangeslider.asp */\n.slider {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 100%;\n  background-color: var(--backgroundColor);\n  transform-origin: var(--transformOrigin);\n  transform: var(--rotation);\n  direction: var(--direction);\n}\n\n.synth-slider::-webkit-slider-thumb {\n  -webkit-appearance: none; /* Override default look */\n  appearance: none;\n  width: var(--handleWidth); /* Set a specific slider handle width */\n  height: var(--handleHeight); /* Slider handle height */\n  background-color: var(--handleColor); /* Green background */\n  border: none;\n  border-radius: 0;\n  cursor: pointer; /* Cursor on hover */\n}\n\n.synth-slider::-moz-range-thumb {\n  width: var(--handleWidth); /* Set a specific slider handle width */\n  height: var(--handleHeight); /* Slider handle height */\n  background-color: var(--handleColor); /* Green background */\n  border: none;\n  border-radius: 0;\n  cursor: pointer; /* Cursor on hover */\n}\n\n.modulation-indicator {\n  position: absolute;\n  background: none;\n  pointer-events: none;\n  top: 0;\n}\n\n.modulation-indicator::-webkit-slider-thumb {\n  -webkit-appearance: none; /* Override default look */\n  appearance: none;\n  width: var(--indicatorWidth); /* Set a specific slider handle width */\n  height: var(--indicatorHeight); /* Slider handle height */\n  background-color: var(--indicatorColor);\n  border: none;\n  border-radius: 0;\n}\n\n.modulation-indicator::-moz-range-thumb {\n  width: var(--indicatorWidth); /* Set a specific slider handle width */\n  height: var(--indicatorHeight); /* Slider handle height */\n  background: var(--indicatorColor);\n  border: none;\n  border-radius: 0;\n}\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-88c1ade8";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('VueSliderWithIndicator', __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };

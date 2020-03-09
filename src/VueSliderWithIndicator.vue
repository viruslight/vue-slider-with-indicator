<template>
  <div class="slider-container" :style="containerStyle">
    <input
      type="range"
      class="slider synth-slider"
      :style="sliderStyle"
      :max="settings.max"
      :min="settings.min"
      :step="settings.step"
      v-model="calculatedSliderValue"
    >
    <input
      type="range"
      class="slider modulation-indicator"
      :style="indicatorStyle"
      :max="settings.max"
      :min="settings.min"
      :step="settings.step"
      v-model="indicatorValue"
    >
  </div>
</template>

<script>
export default {
  name: 'VueSliderWithIndicator',
  data () {
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
      get () {
        const valueOrDefault =
          this.sliderValue === 'undefined'
          ? this.settings.init
          : this.sliderValue
        return valueOrDefault
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    // Setting up CSS variables from the values of the style object.
    // Necessary because pseudo elements like the handle can't be
    // accessed inline.
    containerStyle () {
      let transformOrigin = null
      let rotation = null
      if (this.settings.vertical) {
        const sliderWidth = this.settings.sliderWidth
        const widthValue = sliderWidth.match(/\d+/g)[0]
        const widthUnit = sliderWidth.slice(sliderWidth.match(/\d+/g)[0].length)
        transformOrigin = `${widthValue / 2 + widthUnit} ${widthValue / 2 + widthUnit}`
        rotation = 'rotate(-90deg)'
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
    sliderStyle () {
      return {
        '--handleWidth': this.settings.handleWidth,
        '--handleHeight': this.settings.handleHeight,
        '--handleColor': this.settings.handleColor
      }
    },
    indicatorStyle () {
      return {
        '--indicatorWidth': this.settings.indicatorWidth,
        '--indicatorHeight': this.settings.indicatorHeight,
        '--indicatorColor': this.settings.indicatorColor
      }
    }
  },
  watch: {
    options: function (to, from) {
      for (const option of Object.keys(to)) {
        this.settings[option] = to[option]
      }
    }
  },
  mounted () {

    if (isNaN(this.sliderValue)) {
      console.error(`Expected Number for 'sliderValue', instead got ${this.sliderValue}.`)
    }
    if (isNaN(this.indicatorValue)) {
      console.error(`Expected Number for 'indicatorValue', instead got ${this.indicatorValue}.`)
    }

    if (this.options) {
      for (let opt in this.options) {
        if (opt !== 'style') {
          this.settings[opt] = this.options[opt]
        }
      }
      // If sliderHeight is set, make handle and indicator take up full height
      if (Object.keys(this.options).includes('sliderHeight')) {
        this.settings.handleHeight = this.options['sliderHeight']
        this.settings.indicatorHeight = this.options['sliderHeight']
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slider-container {
  position: relative;
  width: var(--sliderWidth);
  height: var(--sliderHeight);
}

/* From:
https://www.w3schools.com/howto/howto_js_rangeslider.asp */
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background-color: var(--backgroundColor);
  transform-origin: var(--transformOrigin);
  transform: var(--rotation);
  direction: var(--direction);
}

.synth-slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: var(--handleWidth); /* Set a specific slider handle width */
  height: var(--handleHeight); /* Slider handle height */
  background-color: var(--handleColor); /* Green background */
  border: none;
  border-radius: 0;
  cursor: pointer; /* Cursor on hover */
}

.synth-slider::-moz-range-thumb {
  width: var(--handleWidth); /* Set a specific slider handle width */
  height: var(--handleHeight); /* Slider handle height */
  background-color: var(--handleColor); /* Green background */
  border: none;
  border-radius: 0;
  cursor: pointer; /* Cursor on hover */
}

.modulation-indicator {
  position: absolute;
  background: none;
  pointer-events: none;
  top: 0;
}

.modulation-indicator::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: var(--indicatorWidth); /* Set a specific slider handle width */
  height: var(--indicatorHeight); /* Slider handle height */
  background-color: var(--indicatorColor);
  border: none;
  border-radius: 0;
}

.modulation-indicator::-moz-range-thumb {
  width: var(--indicatorWidth); /* Set a specific slider handle width */
  height: var(--indicatorHeight); /* Slider handle height */
  background: var(--indicatorColor);
  border: none;
  border-radius: 0;
}

</style>

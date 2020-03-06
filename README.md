# vue-slider-with-indicator

> A slider for synths

This is a basic Vue.js slider component which in addition to a standard slider handle has an indicator representing an additional value.  

# Usage

Import it as you would import a normal component:

`import VueSliderWithIndicator from 'vue-slider-with-indicator'`

In the template:

    <VueSliderWithIndicator 
      v-model="myValue"
      :value="myValue"
      :indicatorPosition="myIndicatorPosition"
      :options="myOptions"
    />

The options prop expects an object. It could look like this:

    myOptions {
      init: 50,
      min: 0,
      max: 100,
      step: 1,
      style: {
        sliderWidth: '300px',
        sliderHeight: '30px',
        handleWidth: '20px',
        handleHeight: '20px',
        indicatorWidth: '3px',
        indicatorHeight: '25px'
        backgroundColor: '#333',
        handleColor: '#115253',
        indicatorColor: 'rgba(200, 200, 0, 0.8)'
      }
    }

Each property can be omitted, defaulting to the value specified below.

# Options

## Range values

All expect a number.

- `init`: Initial value the handle is set to, default: 50

- `min`: Min value of the slider, default: 0

- `max`: Max value of the slider, default: 100

- `step`, default: 1

## Style

Use any combination of value and unit that you would use in CSS.
All expect a string.

- `sliderWidth`: Width, default: 500px

- `sliderHeight`: Height, default: 50px 

- `handleHeight`: Handle height, default: matching sliderHeight

- `handleWidth`: Handle width, default: 50px

- `indicatorHeight`: Indicator height, default: matching sliderHeight

- `indicatorWidth`: Indicator width, default: 5px

- `backgroundColor`: Background color, default: black

- `handleColor`: Handle color, default: #4CAF50, a greenish color

- `indicatorColor`: Indicator color, default: rgba(255, 136, 0, 0.7), some kind of orange

# vue-slider-with-indicator

> A slider for (e.g.) synths

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
        vertical: true,
        direction: 'rtl',
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

- `init`:
Sets the handle's initial value.
Default is `50`.

- `min`:
Sets the min value of the slider.
Default is `0`.

- `max`:
Sets the max value of the slider.
Default is `100`.

- `step`:
Sets the stepping interval.
Default is `1`.

## Style

### The following expects a boolean:

- `vertical`:
If set to `true` the slider will be vertical instead of horizontal.
`min` will be at the bottom, `max` will be at the top.
Default is `false`.

Please note that `width`s and `height`s are flipped as well. If you set `vertical: true` you will have to change the `sliderWidth` if you want to to change the slider's height.

### The following expect a string:

- `direction`:
If set to `'rtl'` (right to left) `min` will be at the right, `max` will be at the left.
If combined with `vertical: true`, `min` will be at the top, `max` will be at the bottom.
Default is `'ltr'` (left to right).

For the following, use any combination of value and unit that you would use in CSS:

- `sliderWidth`:
Sets the slider's width.
Default ist `'500px'`.

- `sliderHeight`:
Sets the slider's height.
Default is `'50px'`.

- `handleHeight`:
Sets the handle's height.
Default is matching `sliderHeight`.

- `handleWidth`:
Sets the handle's width.
Default is `'50px'`.

- `indicatorHeight`:
Sets the indicator's height.
Default is matching `sliderHeight`.

- `indicatorWidth`:
Sets the indicator's width.
Default is `'5px'`.

For the following, use any color that you would use in CSS:

- `backgroundColor`:
Sets the slider's background color.
Default is `'black'`.

- `handleColor`:
Sets the handle's color.
Default is `'#4CAF50'`, a greenish color.

- `indicatorColor`:
Sets the indicator's color.
Default is `'rgba(255, 136, 0, 0.7)'`, some kind of orange.

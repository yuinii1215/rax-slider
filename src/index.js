import {isWeex} from 'universal-env';
import SliderWeb from './slider.web';
import SliderWeex from './slider.weex';

let Slider = null;
if (isWeex) {
  Slider = SliderWeex;
} else {
  Slider = SliderWeb;
}

export default Slider;

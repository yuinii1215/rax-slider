import {isWeex} from 'universal-env';

let Slider = null;
if (isWeex) {
  Slider = require('./slider.weex');
} else {
  Slider = require('./slider.web');
}

export default Slider;
module.exports = exports.default;

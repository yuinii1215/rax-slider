/** @jsx createElement */

import {createElement} from 'rax';
import cloneElement from 'rax-clone-element';
import View from 'rax-view';

export default (props) => {
  const {total, styles, currentIndex, paginationStyle} = props;
  if (total <= 1) return null;
  Object.assign(styles.defaultPaginationStyle, paginationStyle);
  let {
    itemSelectedColor,
    itemColor,
    itemSize
  } = styles.defaultPaginationStyle;

  const activeStyle = {
    ...styles.activeDot,
    ...{
      backgroundColor: itemSelectedColor,
      width: itemSize,
      height: itemSize
    }
  };

  const normalStyle = {
    ...styles.normalDot,
    ...{
      backgroundColor: itemColor,
      width: itemSize,
      height: itemSize
    }
  };

  let dots = [];
  const ActiveDot = props.activeDot || <View style={activeStyle} />;
  const NormalDot = props.normalDot || <View style={normalStyle} />;
  const realIndex = Math.abs(currentIndex) % total;

  for (let i = 0; i < total; i++) {
    dots.push(i === realIndex ?
      cloneElement(ActiveDot, {key: i}) :
      cloneElement(NormalDot, {key: i}));
  }

  return (
    <View
      style={{
        ...styles.defaultPaginationStyle,
        ...props.paginationStyle
      }}>
      {dots}
    </View>
  );
};

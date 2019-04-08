/** @jsx createElement */
import {createElement, useRef, useEffect, useState} from 'rax';
import View from 'rax-view';
import SwipeEvent from './SwipeEvent';

export default (props) => {
  const {
    styles,
    total,
    childrenRefs,
    style,
    children,
    loop = false,
    autoPlay = false,
    autoplayInterval = 3000,
    index = 0,
    // paginationStyle = null,
    initialVelocityThreshold = 0.7,
    verticalThreshold = 10,
    horizontalThreshold = 10,
    vertical = false,
    onChange = () => {}
  } = props;

  let swipeViewRef = useRef(null);

  let isLoopEnd = (index, direction) => {
    const realIndex = loopedIndex(index);
    if (!loop && (realIndex === total - 1 && direction === 'SWIPE_LEFT' ||
                    realIndex === 0 && direction === 'SWIPE_RIGHT')) {
      return true;
    }
    return false;
  };

  let loopedIndex = (index) => {
    return Math.abs(index) % total;
  };

  let slideTo = (index, direction, isSwiping) => {
    if (isSwiping) return;
    let currentIndex = index;
    if (direction) {
      currentIndex = direction === 'SWIPE_LEFT' ? index + 1 : index - 1;
    } else {
      currentIndex = index;
    }
    const realIndex = loopedIndex(currentIndex);
    const offsetX = realIndex * style.width;

    // translate3d for performance optimization
    let swipeView = swipeViewRef.current;// findDOMNode('swipeView');
    // offsetX 为750基准的值，换成成 rem
    const offsetXRem = -1 * offsetX / 100;
    const styleText = `translate3d(${offsetXRem}rem, 0rem, 0rem)`;
    swipeView.style.transform = styleText;
    swipeView.style.webkitTransform = styleText;

    let childView = childrenRefs[realIndex].current;
    childView.style.left = offsetXRem;
    onChange({index: realIndex});
    // console.log(realIndex, currentIndexx);
    // setCurrentIndexx(1234);
    return {realIndex, offsetX};
  };

  const isSwipingRef = useRef(false);
  const offsetXRef = useRef(0);
  const currentIndexRef = useRef(index);
  // const [currentIndexx, setCurrentIndexx] = useState(0);

  let onSwipeBegin = () => {
    isSwipingRef.current = true;
  };

  let onSwipeEnd = ({direction}) => {
    let realIndex = loopedIndex(currentIndexRef.current);
    isSwipingRef.current = false;
    if (!isLoopEnd(realIndex, direction)) {
      let result = slideTo(currentIndexRef.current, direction, false);
      realIndex = result.realIndex;
      offsetXRef.current = result.offsetX;
      currentIndexRef.current = realIndex;
    }
    // console.log('xxx:'+currentIndexx);
  };

  let onSwipe = ({direction, distance}) => {
    // console.log(currentIndexx);
    if (isLoopEnd(currentIndexRef.current, direction)) return;
    // offsetX  为以 750 为基准的 px 值，需要换算成当前屏幕的比例值才能计算
    const offsetX = offsetXRef.current;
    let changeX = distance - offsetX * document.documentElement.clientWidth / 750;
    let swipeView = swipeViewRef.current;
    // console.log(changeX, 'offsetX:'+offsetX);
    // distance 为当前屏幕 px 值，需要换算成基于 750 的 rem 值
    const styleText = `translate3d(${changeX * 7.5 / document.documentElement.clientWidth}rem, 0rem, 0rem)`;
    swipeView.style.transform = styleText;
    swipeView.style.webkitTransform = styleText;
  };

  let loopPlay = () => {
    let realIndex = loopedIndex(currentIndexRef.current);
    if (!isSwipingRef.current) {
      if (!isLoopEnd(realIndex, 'SWIPE_LEFT')) {
        let result = slideTo(currentIndexRef.current, 'SWIPE_LEFT', false);
        realIndex = result.realIndex;
        offsetXRef.current = result.offsetX;
        currentIndexRef.current = realIndex;
      }
    }
    // console.log('xxx:'+currentIndexx);
  };

  useEffect(() => {
    let autoPlayTimer = null;
    if (autoPlay && total > 1) {
      autoPlayTimer = setInterval(() => {
        loopPlay();
      }, parseFloat(autoplayInterval));
    };
    return () => {
      autoPlayTimer && clearInterval(autoPlayTimer);
    };
  });

  return total > 1 ?
    <SwipeEvent
      style={{
        ...styles.swipeWrapper,
        ...style,
      }}
      onSwipeBegin={onSwipeBegin}
      onSwipeEnd={onSwipeEnd}
      onSwipe={onSwipe}
      initialVelocityThreshold={initialVelocityThreshold}
      verticalThreshold={verticalThreshold}
      vertical={vertical}
      horizontalThreshold={horizontalThreshold}>
      <div ref={swipeViewRef} style={{
        ...styles.swipeStyle,
        ...style,
        ...{
          width: style.width * total
        }
      }}>
        {children}
      </div>
    </SwipeEvent>
    :
    <View ref={swipeViewRef} style={{
      ...styles.swipeStyle,
      ...style
    }}>
      {children}
    </View>
  ;
};
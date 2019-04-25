let isLoopEnd = (index, direction, isLoop, total) => {
  const realIndex = loopedIndex(index, total);
  if (!isLoop && (realIndex === total - 1 && direction === 'SWIPE_LEFT' ||
                  realIndex === 0 && direction === 'SWIPE_RIGHT')) {
    return true;
  }
  return false;
};

let loopedIndex = (index, total) => {
  return Math.abs(index) % total;
};

let slideTo = (index, direction, isSwiping, style, swipeViewRef, childrenRefs, onChange, total) => {
  if (isSwiping) return;
  let currentIndex = index;
  if (direction) {
    currentIndex = direction === 'SWIPE_LEFT' ? index + 1 : index - 1;
  } else {
    currentIndex = index;
  }
  const realIndex = loopedIndex(currentIndex, total);
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
  return {realIndex, offsetX};
};

export default (state, action) => {
  const {loop, total, style, swipeViewRef, childrenRefs, onChange} = state;
  switch (action.type) {
    case 'SWIPE_BEGIN':
      return {...state, isSwiping: true};// state
    case 'SWIPE': {
      const { direction, distance } = action.event;
      const {currentIndex, offsetX} = state;
      // distance 为当前屏幕的值
      if (isLoopEnd(currentIndex, direction, loop, total)) return state;
      // offsetX  为以 750 为基准的 px 值，需要换算成当前屏幕的比例值才能计算
      let changeX = distance - offsetX * document.documentElement.clientWidth / 750;
      let swipeView = swipeViewRef.current;
      // console.log(changeX, 'offsetX:'+offsetX);
      // distance 为当前屏幕 px 值，需要换算成基于 750 的 rem 值
      const styleText = `translate3d(${changeX * 7.5 / document.documentElement.clientWidth}rem, 0rem, 0rem)`;
      swipeView.style.transform = styleText;
      swipeView.style.webkitTransform = styleText;
      return state;// state
    }
    case 'SWIPE_END': {
      const { direction } = action.event;
      let {currentIndex, offsetX} = state;
      let realIndex = loopedIndex(currentIndex, total);
      if (!isLoopEnd(realIndex, direction, loop, total)) {
        let result = slideTo(currentIndex, direction, false, style, swipeViewRef, childrenRefs, onChange, total);
        realIndex = result.realIndex;
        offsetX = result.offsetX;
      }
      return {...state, isSwiping: false, currentIndex: realIndex, offsetX};// state
    }
    case 'LOOP_PLAY': {
      let {currentIndex, offsetX, isSwiping} = state;
      let realIndex = loopedIndex(currentIndex, total);
      if (!isSwiping) {
        const { direction } = action.event;
        if (!isLoopEnd(realIndex, direction, loop, total)) {
          let result = slideTo(currentIndex, direction, false, style, swipeViewRef, childrenRefs, onChange, total);
          realIndex = result.realIndex;
          offsetX = result.offsetX;
        }
      }
      return {...state, currentIndex: realIndex, offsetX};// state
    }
  }
};
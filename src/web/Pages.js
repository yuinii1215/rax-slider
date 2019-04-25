/** @jsx createElement */
import {createElement} from 'rax';
import View from 'rax-view';

export default (props) => {
  const {children, childrenStyle, width, height, childrenRefs} = props;
  if (!children.length || children.length <= 1) {
    return <View style={childrenStyle}>{children}</View>;
  }

  return children.map((child, index) => {
    let translateStyle = {
      width: width,
      height: height,
      left: index * width
    };
    return (
      <div ref={childrenRefs[index]} className={'childWrap' + index}
        style={{
          ...childrenStyle,
          ...translateStyle
        }} key={index}>
        {child}
      </div>
    );
  });
};
import {createElement, useState} from 'rax';


export default (props) => {
  let [index, setIndex] = useState(0);

  let onChange = (e) => {
    setIndex({index: e.currentTarget.attr.index});
    props.onChange && props.onChange(e);
  };

  // let slideTo = (index) => {
  //     setIndex({
  //         index: index
  //     });
  // }

  let handleNativeProps = (props) => {
    const {
      defaultPaginationStyle = {
        position: 'absolute',
        width: 750,
        height: 40,
        bottom: 20,
        left: 0,
        itemColor: 'rgba(255, 255, 255, 0.5)',
        itemSelectedColor: 'rgb(255, 80, 0)',
        itemSize: 8
      },
      autoPlay,
      showsPagination,
      paginationStyle,
      autoPlayInterval,
      loop,
      width,
      height,
      index = index
    } = props;

    let nativeProps = {
      onChange: onChange,
      autoPlay: autoPlay,
      showIndicators: showsPagination,
      paginationStyle: paginationStyle ? paginationStyle : defaultPaginationStyle,
      interval: autoPlayInterval,
      infinite: loop,
      index: index,
      ...{
        style: {
          width: width,
          height: height,
          ...props.style
        }
      }
    };

    return nativeProps;
  };

  const children = props.children;
  const nativeProps = handleNativeProps(props);
  return (
    <slider {...nativeProps}>
      {nativeProps.showIndicators ?
        <indicator style={nativeProps.paginationStyle} /> :
        null}
      {children}
    </slider>
  );
};
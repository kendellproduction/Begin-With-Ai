import React from 'react';

const HeadingBlock = ({ 
  content = {}, 
  config = {}, 
  className = "",
  styles = {},
  onComplete = () => {} 
}) => {
  const {
    text = 'Heading',
    level = 1
  } = content;

  const {
    clickable = false
  } = config;

  // Merge default styles with custom styles
  const defaultStyles = {
    fontSize: level === 1 ? '32px' : level === 2 ? '28px' : level === 3 ? '24px' : level === 4 ? '20px' : level === 5 ? '18px' : '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
    margin: { top: 0, bottom: 16, left: 0, right: 0 },
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  const mergedStyles = { ...defaultStyles, ...styles };

  // Convert margin and padding objects to CSS
  const marginStyle = mergedStyles.margin 
    ? `${mergedStyles.margin.top}px ${mergedStyles.margin.right}px ${mergedStyles.margin.bottom}px ${mergedStyles.margin.left}px`
    : '0';
  
  const paddingStyle = mergedStyles.padding 
    ? `${mergedStyles.padding.top}px ${mergedStyles.padding.right}px ${mergedStyles.padding.bottom}px ${mergedStyles.padding.left}px`
    : '0';

  const headingStyle = {
    fontSize: mergedStyles.fontSize,
    fontWeight: mergedStyles.fontWeight,
    color: mergedStyles.color,
    textAlign: mergedStyles.textAlign,
    margin: marginStyle,
    padding: paddingStyle,
    lineHeight: mergedStyles.lineHeight || '1.2'
  };

  const HeadingTag = `h${Math.max(1, Math.min(6, level))}`;

  const handleClick = () => {
    if (clickable) {
      onComplete({ text, level, clicked: true });
    }
  };

  const headingContent = (
    React.createElement(HeadingTag, {
      style: headingStyle,
      className: `heading-block-content ${className} ${clickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`,
      onClick: handleClick
    }, text)
  );

  return (
    <div className="heading-block">
      {headingContent}
    </div>
  );
};

export default HeadingBlock; 
import React from 'react'

export interface ButtonProps {
  /**
   * @description kind
   * @default "null"
   */
  onClick?: () => void;
  /**
   * @description 属性描述
   * @default "null"
   */
  text: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, ...rest }) => (
  <button onClick={onClick} {...rest}>
  {text}
</button>
)

export default Button;
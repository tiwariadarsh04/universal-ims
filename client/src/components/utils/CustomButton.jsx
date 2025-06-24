import { Button } from '@mui/material'

const CustomButton = ({title,handleBtnClick,color,type,...rest}) => {
  return (
    <Button 
        onClick={handleBtnClick}
        variant={type}
        color={color} 
        {...rest}
    >
        {title}
    </Button>
  )
}

export default CustomButton
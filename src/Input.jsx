import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

/**
 * Position input with x and y boxes and increment/decrement arrows
 */
export function PositionInput(props) {
  const [x, setX] = React.useState(props.x);
  const [y, setY] = React.useState(props.y);

  React.useEffect(() => setX(props.x), [props.x]);
  React.useEffect(() => setY(props.y), [props.y]);

  const handleXChange = (event) => {
    const x = event.target.value
    setX(x === '' ? '' : Number(x));
    if (x !== '') { 
      props.onXChange(Number(x));
    }
  };

  const handleYChange = (event) => {
    const y = event.target.value
    setY(y === '' ? '' : Number(y));
    if (y !== '')
      props.onYChange(Number(y));
  };

  const handleXBlur = () => {
    if (x < props.minX) {
      setX(props.minX);
      props.onXChange({ x: props.minX, y: y });
    } else if (x > props.maxX) {
      setX(props.maxX);
      props.onXChange({ x: props.maxX, y: y });
    }
  };

  const handleYBlur = () => {
    if (y < props.minY) {
      setY(props.minY);
      props.onYChange({ x: x, y: props.minY });
    } else if (y > props.maxY) {
      setY(props.maxY);
      props.onYChange({ x: x, y: props.maxY });
    }
  };

  return (
    <Box>
      <Grid container alignItems="center">
        <Grid item sx={{ mr: 2}}>
          <Typography id="input-slider" variant='h6' gutterBottom>{props.name}</Typography>
        </Grid>
        <Grid item sx={{ mr: 1}}>
          <Typography id="input-slider" variant='h6' gutterBottom>X</Typography>
        </Grid>
        <Grid item sx={{ mr: 2}}>
          <Input
            value={x}
            size="small"
            onChange={handleXChange}
            onBlur={handleXBlur}
            inputProps={{
              step: props.step,
              min: props.minX,
              max: props.maxX,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={props.disabled}
          />
        </Grid>
        <Grid item sx={{ mr: 1}}>
          <Typography id="input-slider" variant='h6' gutterBottom>Y</Typography>
        </Grid>
        <Grid item>
          <Input
            value={y}
            size="small"
            onChange={handleYChange}
            onBlur={handleYBlur}
            inputProps={{
              step: props.step,
              min: props.minY,
              max: props.maxY,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={props.disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Slider input with label and number input box
 */
export function InputSlider(props) {
  const [value, setValue] = React.useState(props.value);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    setValue(newValue);
    props.onChange(newValue);
  }

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    if (event.target.value !== '')
      props.onChange(Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < props.min) {
      setValue(props.min);
      props.onChange(props.min);
    } else if (value > props.max) {
      setValue(props.max);
      props.onChange(props.max);
    }
  };

  return (
    <Box sx={{width: props.width || 'auto'}}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography id="input-slider" variant='h6' gutterBottom>{props.name}</Typography>
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            aria-labelledby="input-slider"
            step={props.step}
            min={props.min}
            max={props.max}
            disabled={props.disabled}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onInput={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: props.step,
              min: props.min,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={props.disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Input with label and number input box
 */
export function NumberInput(props) {
  const [value, setValue] = React.useState(props.value);
  if (props.value !== value) {
    setValue(props.value);
  }

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    if (event.target.value !== '')
      props.onChange(Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < props.min) {
      setValue(props.min);
      props.onChange(props.min);
    } else if (value > props.max) {
      setValue(props.max);
      props.onChange(props.max);
    }
  };

  return (
    <Box sx={{width: props.width || 'auto'}}>
      <Grid container spacing={2} alignItems="center">
        {/* <Grid item>
          <Typography id="input-slider" variant='h6' gutterBottom>{props.name}</Typography>
        </Grid> */}
        <Grid item>
          <Input
            value={value}
            size="small"
            onInput={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: props.step,
              min: props.min,
              max: props.max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
            disabled={props.disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

# Screen Testing App


Simple touchscreen testing application created for QA purposes at work using Electron.

 

To quote my boss:

> Holy S**t Mac! That's exactly what we needed!

  

## Features

- Multitouch Drawing

- Brush Size Adjustment

- Dynamic tests

- Solid color, Gradient, Stripes

  
## Dynamic Tests
ScreenTest uses a `tests.json` file as a list of available test types and which colors, etc.
Currently only three types of tests are implemented, `solid`, `gradient` and `striped`.

Each test type has basic properties:
`type` - The type of test.
`colors` - A String list of colors in Hexadecimal format.

### Solid Test
Displays only a single color, if the test has multiple colors, only the first one will be displayed.
Solid test does not have any special properties.

### Gradient Test
Displays a gradient on screen given two color values in the `colors` property.
Gradient test requires an extra property, `direction`.
The `direction` property can take two values, `vertical` and `horizontal` to specify gradient direction.

If you need to invert the gradients, simply swap the starting and ending colors in the `colors` property. 
  
### Striped Test
Displays a dynamic array to fill the screen with the desired colors. 
The amount of stripes displayed depends on the amount of colors provided in `colors` property.
Striped test requires an extra property, direction.
The `direction` property can take two values, `vertical` and `horizontal` to specify stipes direction.



## Building
*Building is a little broken, you will have to figure it out but for the most part...*
Clone the repo...
Install dependencies...
```
npm install
```
Make changes, create 
Build...
```
npm run dist
```
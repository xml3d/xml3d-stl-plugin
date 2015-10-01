# xml3d-stl-plugin [![Build Status](https://img.shields.io/npm/l/shade.js.svg)](http://opensource.org/licenses/MIT)

Plugin to use STL models as external mesh references. Check-out [the example](http://xml3d.github.io/xml3d-stl-plugin/examples/).

## Usage

### Server
The plug-in to encode mesh models is not chosen by file ending but by media type. So make sure your STL models are delivered with media type ``application/vnd.ms-pki.stl``. In the response header of the STL file you should find:

    Content-Type: application/vnd.ms-pki.stl


### Client
```html
<group ...>
   <mesh src="../path/to/model.stl"></mesh>
</group>
```

## Acknowledgments
This plug-in is based on the great [stl-reader](https://github.com/tatx/stl-reader) library from [tatx](https://github.com/tatx). The STL models used in the example are from the same repository.

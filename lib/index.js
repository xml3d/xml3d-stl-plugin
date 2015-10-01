var STLReader = require("stl-reader");
var assert = require("assert");

var STLFormatHandler = function () {
    XML3D.resource.FormatHandler.call(this);
}
XML3D.createClass(STLFormatHandler, XML3D.resource.FormatHandler);

STLFormatHandler.prototype.isFormatSupported = function (response, responseType, mimetype) {
    return mimetype === "application/vnd.ms-pki.stl";
};

STLFormatHandler.prototype.getFormatData = function (response, responseType, mimetype, callback) {
    try {
        assert(response instanceof ArrayBuffer);
        var res = new STLReader().read(response);
        assert(res);
        var xflowNode = createXflowNode(res.vertices, res.normals);
        callback(true, xflowNode);
    } catch (e) {
        XML3D.debug.logError("Failed to process STL file: " + e);
        callback(false);
    }

};

var stlFormatHandler = new STLFormatHandler();
XML3D.resource.registerFormat(stlFormatHandler);


function createXflowNode(positions, normals) {
    assert(positions, "No positions found");
    assert(normals, "No normals found");
    assert(normals.length == positions.length, "Normals and position have the same size");

    var node = new Xflow.DataNode();

    var inputNode = new Xflow.InputNode();
    inputNode.data = new Xflow.BufferEntry(Xflow.constants.DATA_TYPE.FLOAT3, positions);
    inputNode.name = "position";
    node.appendChild(inputNode);

    inputNode = new Xflow.InputNode();
    inputNode.data = new Xflow.BufferEntry(Xflow.constants.DATA_TYPE.FLOAT3, normals);
    inputNode.name = "normal";
    node.appendChild(inputNode);
    return node;
}

/**
 * @implements IDataAdapter
 */
var STLDataAdapter = function (xflowNode) {
    this.xflowDataNode = xflowNode;
};

STLDataAdapter.prototype.getXflowNode = function () {
    return this.xflowDataNode;
}

/**
 * @constructor
 * @implements {XML3D.base.IFactory}
 */
var STLFactory = function () {
    XML3D.resource.AdapterFactory.call(this, "data");
};
XML3D.createClass(STLFactory, XML3D.resource.AdapterFactory);

STLFactory.prototype.aspect = "data";
STLFactory.prototype.createAdapter = function (xflowNode) {
    return new STLDataAdapter(xflowNode);
}
XML3D.resource.addBinaryExtension('.stl');
XML3D.resource.addBinaryContentType('application/vnd.ms-pki.stl');
stlFormatHandler.registerFactoryClass(STLFactory);


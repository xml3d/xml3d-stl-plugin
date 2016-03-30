var STLReader = require("stl-reader");
var assert = require("assert");

var STLFormatHandler = function () {
    XML3D.resource.FormatHandler.call(this);
};
XML3D.createClass(STLFormatHandler, XML3D.resource.FormatHandler);

STLFormatHandler.prototype.isFormatSupported = function (response) {
    if (response.headers.has("Content-Type")) {
        var ct = response.headers.get("Content-Type");
        if (ct.match(/vnd\.ms-pki.?stl/i) || ct.match(/application\/sla/i)) {
            return true;
        }
    }
    return !!response.url.match(/\.stl\W/i);
};

STLFormatHandler.prototype.getFormatData = function (response) {
    return response.arrayBuffer().then(function(buffer) {
        var body = new STLReader().read(buffer);
        assert(body);
        return createXflowNode(body.vertices, body.normals);
    });
};

STLFormatHandler.prototype.getAdapter = function(xflowNode, aspect, canvasId) {
    return new STLDataAdapter(xflowNode);
};

XML3D.resource.registerFormatHandler(new STLFormatHandler());

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
};
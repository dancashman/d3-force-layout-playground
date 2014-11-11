'use strict';

var width = 600;
var height = 500;
var force;
var svg;
var link;
var node;
var dataset = {};

// Color leaf nodes orange, and packages white or blue.
function color(d) {
  return d._children ? '#3182bd' : d.children ? '#c6dbef' : '#fd8d3c';
}

// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [];
  var i = 0;

  function recurse(node) {

    if (node.children) {
      node.children.forEach(recurse);
    }

    if (!node.id) {
      node.id = ++i;
    }

    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function tick() {
  link.attr('x1', function(d) {
    return d.source.x;
  })
  .attr('y1', function(d) {
    return d.source.y;
  })
  .attr('x2', function(d) {
    return d.target.x;
  })
  .attr('y2', function(d) {
    return d.target.y;
  });

  node.attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (!d3.event.defaultPrevented) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update();
  }
}

function update() {
  var nodes = flatten(dataset);
  var links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force.nodes(nodes)
    .links(links)
    .start();

  // Update the links…
  link = link.data(links, function(d) {
    return d.target.id;
  });

  // Exit any old links.
  link.exit().remove();

  // Enter any new links.
  link.enter().insert('line', '.node')
    .attr('class', 'link')
    .attr('x1', function(d) {
      return d.source.x;
    })
    .attr('y1', function(d) {
      return d.source.y;
    })
    .attr('x2', function(d) {
      return d.target.x;
    })
    .attr('y2', function(d) {
      return d.target.y;
    });

  // Update the nodes…
  node = node.data(nodes, function(d) {
    return d.id;
  }).style('fill', color);

  // Exit any old nodes.
  node.exit().remove();

  // Enter any new nodes.
  node.enter().append('circle')
    .attr('class', 'node')
    .attr('cx', function(d) {
      return d.x;
    })
    .attr('cy', function(d) {
      return d.y;
    })
    .attr('r', function(d) {
      return Math.sqrt(d.size) / 10 || 4.5;
    })
    .style('fill', color)
    .on('click', click)
    .call(force.drag);
}

force = d3.layout.force()
  .size([width, height])
  .on('tick', tick);

svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

link = svg.selectAll('.link');
node = svg.selectAll('.node');

function datasetOne() {
  dataset = {
    'name': 'base',
    'children': [{
      'name': 'node-one',
      'children': [{
        'name': 'child-one'
      }, {
        'name': 'child-two'
      }]
    }, {
      'name': 'node-two'
    }, {
      'name': 'node-three'
    }, {
      'name': 'node-four'
    }, {
      'name': 'node-five'
    }]
  };
}

function datasetTwo() {
  dataset = {
    'name': 'base',
    'children': [{
      'name': 'node-one',
      'children': [{
        'name': 'child-one'
      }, {
        'name': 'child-two'
      }, {
        'name': 'child-three'
      }, {
        'name': 'child-four'
      }]
    }, {
      'name': 'node-two'
    }, {
      'name': 'node-three'
    }, {
      'name': 'node-four'
    }, {
      'name': 'node-five'
    }]
  };
}

document.getElementById('currentData').onclick = function() {
  var string = JSON.stringify(dataset);
  window.alert(string);
};

document.getElementById('datasetOne').onclick = function() {
  datasetOne();
  update();
};
document.getElementById('datasetTwo').onclick = function() {
  datasetTwo();
  update();
};

(function() {
  datasetOne();
  update();
})();

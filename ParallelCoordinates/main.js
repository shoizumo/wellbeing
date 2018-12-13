(() => {
  let Continent = ['Africa', 'Asia', 'Europe', 'NorthAmerica', 'Oceania', 'SouthAmerica'];
  let columns = ['corruption', 'freedom', 'generosity', 'ladder', 'life_expectancy',
    'logGdp', 'negative', 'positive', 'social_support'];

  let m = [80, 160, 200, 160],
      w = 1000 - m[1] - m[3],
      h = 800 - m[0] - m[2];

  let x = d3.scale.ordinal().domain(columns).rangePoints([0, w]),
      y = {};

  let line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      foreground;

  let svg = d3.select("body").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  d3.csv("PCdata.csv", function (data) {
    console.log(data);


    // Create a scale and brush for each trait.
    columns.forEach(function (d) {
      // Coerce values to numbers.
      data.forEach(function (p) {
        p[d] = +p[d];
      });

      y[d] = d3.scale.linear()
          .domain(d3.extent(data, function (p) {
            return p[d];
          }))
          .range([h, 0]);

      y[d].brush = d3.svg.brush()
          .y(y[d])
          .on("brush", brush);
    });

    // Add a legend.
    let legend = svg.selectAll("g.legend")
        .data(Continent)
        .enter().append("svg:g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + (i * 20 + 584) + ")";
        });

    legend.append("svg:line")
        .attr("class", String)
        .attr("x2", 8);

    legend.append("svg:text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(function (d) {
          return d;
        });

    // Add foreground lines.
    foreground = svg.append("svg:g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("svg:path")
        .attr("d", path)
        .attr("class", function (d) {
          return d.Continent;
        });

    // Add a group element for each trait.
    let g = svg.selectAll(".trait")
        .data(columns)
        .enter().append("svg:g")
        .attr("class", "trait")
        .attr("transform", function (d) {
          return "translate(" + x(d) + ")";
        })
        .call(d3.behavior.drag()
            .origin(function (d) {
              return {x: x(d)};
            })
            .on("dragstart", dragstart)
            .on("drag", drag)
            .on("dragend", dragend));

    // Add an axis and title.
    g.append("svg:g")
        .attr("class", "axis")
        .each(function (d) {
          d3.select(this).call(axis.scale(y[d]));
        })
        .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(String);

    // Add a brush for each axis.
    g.append("svg:g")
        .attr("class", "brush")
        .each(function (d) {
          d3.select(this).call(y[d].brush);
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function dragstart(d) {
      i = columns.indexOf(d);
    }

    function drag(d) {
      x.range()[i] = d3.event.x;
      columns.sort(function (a, b) {
        return x(a) - x(b);
      });
      g.attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      });
      foreground.attr("d", path);
    }

    function dragend(d) {
      x.domain(columns).rangePoints([0, w]);
      let t = d3.transition().duration(500);
      t.selectAll(".trait").attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      });
      t.selectAll(".foreground path").attr("d", path);
    }
  });

// Returns the path for a given data point.
  function path(d) {
    return line(columns.map(function (p) {
      return [x(p), y[p](d[p])];
    }));
  }

// Handles a brush event, toggling the display of foreground lines.
  function brush() {
    let actives = columns.filter(function (p) {
          return !y[p].brush.empty();
        }),
        extents = actives.map(function (p) {
          return y[p].brush.extent();
        });
    foreground.classed("fade", function (d) {
      return !actives.every(function (p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      });
    });
  }
})();
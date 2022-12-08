//Рандомайзер
function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function randInRange(range) {
    let min = range[0];
    let max = range[1];
    return randBetween(min, max);
}

const xRange = [0, 100];
const yRange = [0, 100];
const xAxisRange = [xRange[0], xRange[1]*1.05];
const yAxisRange = [yRange[0], yRange[1]*1.05];

const radius = 5;
const rombSide = 2 / Math.sqrt(2) * radius;

const circles = 25;
const rhombuses = 25;

let circleArray = [];
let rhombusArray = [];

function generate(){
    circleArray.length = 0;
    rhombusArray.length = 0;
    for (let i = 0; i < circles; i++) {
        circleArray.push({x: randInRange(xRange), y: randInRange(yRange)});
    }
    for (let i = 0; i < rhombuses; i++) {
        rhombusArray.push({x: randInRange(xRange), y: randInRange(yRange)});
    }
    Plot.update();
}

function clearScreen(){
    circleArray.length = 0;
    rhombusArray.length = 0;
    Plot.update();
}

class Plot {
    static svg;
    static xScale;
    static yScale;

    static build() {
        var margin = {left: 50, right: 50, top: 50, bottom: 50},
            width = 500,
            height = 500;

        this.svg = d3.select("#plot-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Добавление Х  линии координаты
        this.xScale = d3.scaleLinear()
            .domain(xAxisRange)
            .range([0, width]);
        var xAxis = d3.axisBottom(this.xScale)
            .tickSizeOuter(0);
        this.svg.append("g")
            .attr('class', 'axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Добавление Y линии координаты
        this.yScale = d3.scaleLinear()
            .domain(yAxisRange)
            .range([height, 0]);
        var yAxis = d3.axisLeft(this.yScale)
            .tickSizeOuter(0);
        this.svg.append("g")
            .attr('class', 'axis')
            .call(yAxis);
        this.svg.selectAll('.axis path.domain')
            .attr('marker-end', 'url(#arrow)');

        // Добавление нзвания X
        this.svg
            .append("text")
            .attr("class", "svg_title")
            .attr("x", width + 15)
            .attr("y", height + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("X");

        // Добавление названия Y
        this.svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr(
                "transform",
                `translate(${0}, ${-15})`
            )
            .style("font-size", "20px")
            .text("Y");
    }

    static clear() {
        var circles =  document.getElementById('circles');
        if (typeof(circles) != 'undefined' && circles != null)
            circles.remove();

        var rhombuses =  document.getElementById('rhombuses');
        if (typeof(rhombuses) != 'undefined' && rhombuses != null)
            rhombuses.remove();
    }

    static update() {
        this.clear();

        this.svg.append('g')
            .attr('id', 'circles')
            .selectAll("dot")
            .data(circleArray)
            .enter()
            .append("circle")
            .attr("class", "Сircles")
            .attr("cx", (d) => {
                return this.xScale(d.x);
            })
            .attr("cy", (d) => {
                return this.yScale(d.y);
            })
            .attr("r", radius)
            .style("fill", "#008000")

        this.svg.append('g')
            .attr('id', 'rhombuses')
            .selectAll("dot")
            .data(rhombusArray)
            .enter()
            .append("rect")
            .attr("class", "Rhombuses")
            .attr("x", 0)
            .attr("y", 0)
            .attr('width', rombSide + 'px')
            .attr('height', rombSide + 'px')
            .style("fill", "#FF0000")

        let a = document.getElementsByClassName("Rhombuses");
        for (let i = 0; i < a.length; i++) {
            let xPx = this.xScale(rhombusArray[i]['x']);
            let yPx = this.yScale(rhombusArray[i]['y']) - Math.sqrt(2) * rombSide / 2;
            a[i].style.transform = 'translate(' + xPx + 'px, ' + yPx + 'px) rotate(45deg)';
        }
    }
}

Plot.build();
// generateData();
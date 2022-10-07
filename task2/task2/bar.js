async function drawBar() {

    const dataset = await d3.json("./my_weather_data.json")
 
    const width = 600
    let dimensions = {
      width: width,
      height: width * 0.8,
      margin: {
        top: 20,
        right: 30,
        bottom: 20,
        left: 30,
      },
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom

    // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    // init static elements
    bounds.append("g")
        .attr("class", "bins")
    bounds.append("line")
        .attr("class","mean")
    bounds.append("g")
        .attr("class", "x-axis")
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)

    const drawHistogram = metric => {
        //Accessor
        const metricAccessor = d => d[metric];
        const yAccessor = d => d.length;

        const exitTransition = d3.transition().duration(600)
        const updateTransition = exitTransition.transition().duration(600)

        const xScaler = d3.scaleLinear()
            .domain(d3.extent(dataset, metricAccessor))
            .range([0, dimensions.boundedWidth])
            .nice()

        const binsGen = d3.bin()
            .domain(xScaler.domain())
            .value(metricAccessor)
            .thresholds(12);

        const bins = binsGen(dataset);
        console.log(bins);

        const yScaler = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dimensions.boundedHeight, 0])

        let binGroups = bounds.select(".bins").selectAll(".bin").data(bins)

        const oldBinGroups = binGroups.exit()
        oldBinGroups.selectAll("rect")
            .style("fill", "orangered")
            .transition(exitTransition)
            .attr("y", dimensions.boundedHeight)
            .attr('height', 0)
        oldBinGroups.selectAll("text")
            .transition(exitTransition)
            .attr("y", dimensions.boundedHeight)

        oldBinGroups.transition(exitTransition).remove()

        const newBinGroups = binGroups.enter().append("g")
            .attr("class", "bin")

        newBinGroups.append("rect")
        newBinGroups.append("text")

        binGroups = newBinGroups.merge(binGroups)

        const barPadding = 1

        const barRect = binGroups.select("rect")
            .transition(updateTransition)
            .attr("x", d => xScaler(d.x0) + barPadding / 2)
            .attr("y", d => yScaler(yAccessor(d)))
            .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
            .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
            .transition()
            .style("fill","cornflowerblue")


        const barText = binGroups.select("text")
            .transition(updateTransition)
            .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0)) / 2)
            .attr("y", d => yScaler(yAccessor(d)) - 5)
            .text(d => yAccessor(d) || "")



        const mean = d3.mean(dataset, metricAccessor);
        console.log(mean);
        const meanLine = bounds.selectAll(".mean")
            .transition(updateTransition)
            .attr("x1", xScaler(mean))
            .attr("x2", xScaler(mean))
            .attr("y1", -15)
            .attr("y2", dimensions.boundedHeight)

        const xAxisGen = d3.axisBottom()
            .scale(xScaler);
        const xAxis = bounds.select("x-axis")
            .transition(updateTransition)
            .call(xAxisGen)
            .style("transform", `translateY(${dimensions.boundedHeight}px)`);


    }

 
    const metrics = [
        "temperatureMin",
        "temperatureMax",
        "temperatureHigh",
        "temperatureLow"
    ]
    let mIndex = 0

    drawHistogram("temperatureHigh")
    const button1 = d3.select("body")
        .append("button")
        .text("Temperature High")


    const button2 = d3.select("body")
        .append("button")
        .text("Temperature Low")


    const button3 = d3.select("body")
        .append("button")
        .text("Temperature Min")


    const button4 = d3.select("body")
        .append("button")
        .text("Temperature Max")

    button1.node().addEventListener("click", onClick1)
    button2.node().addEventListener("click", onClick2)
    button3.node().addEventListener("click", onClick3)
    button4.node().addEventListener("click", onClick4)



    

    function onClick1() {
        mIndex = (mIndex + 1) % metrics.length
        drawHistogram("temperatureHigh")
        console.log(mIndex)
    }

    function onClick2() {
        mIndex = (mIndex + 1) % metrics.length
        drawHistogram("temperatureLow")
        console.log(mIndex)
    }

    function onClick3() {
        mIndex = (mIndex + 1) % metrics.length
        drawHistogram("temperatureMin")
        console.log(mIndex)
    }

    function onClick4() {
        mIndex = (mIndex + 1) % metrics.length
        drawHistogram("temperatureMax")
        console.log(mIndex)
    }

}

drawBar()

import React from "react";
import ReactApexChart from "react-apexcharts";
import {PriceOfPercentage} from "../../../../services/DataService";
class WidgetChartIndex3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: props.data[0].symbol,
          data: props.data[0].price,
        },
      ],
      options: {
        chart: {
          height: 70,
          type: "line",
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          sparkline: {
            enabled: true,
          },
        },
        colors: ["black"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          width: 6,
          curve: "smooth",
          colors: ["white"],
        },
        grid: {
          show: false,
          borderColor: "#eee",
          padding: {
            top: 10,
            right: 0,
            bottom: 20,
            left: 0,
          },
        },
        states: {
          normal: {
            filter: {
              type: "none",
              value: 0,
            },
          },
          hover: {
            filter: {
              type: "none",
              value: 0,
            },
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: "none",
              value: 0,
            },
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            style: {
              fontSize: "12px",
            },
          },
          crosshairs: {
            show: false,
            position: "front",
            stroke: {
              width: 1,
              dashArray: 3,
            },
          },
          tooltip: {
            enabled: false,
            formatter: undefined,
            offsetY: 0,
            style: {
              fontSize: "12px",
              background: "#333",
            },
          },
        },
        yaxis: {
          show: false,
        },
        fill: {
          opacity: 1,
          colors: "white",
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: "Poppins",
            background: "#000",
          },
          y: {
            formatter: function (val) {
              return "$" + PriceOfPercentage(val,props.price)?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + "";
            },
          },
        },
      },
    };
  }

  // on props change update chart
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        series: [
          {
            name: this.props.data[0].symbol,
            data: this.props.data[0].price,
          },
        ],
      });
    }
  }

  

  render() {
    return (
      <div id="widgetChart3" className="chart-primary">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={70}
        />
      </div>
    );
  }
}

export default WidgetChartIndex3;

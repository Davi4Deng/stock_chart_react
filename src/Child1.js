import React, { Component } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Child1.css";

// customTooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>Date: {label}</p>
        <p>Open: {data.Open.toFixed(2)}</p>
        <p>Close: {data.Close.toFixed(2)}</p>
        <p>Difference: {data.difference.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: [],
      company: "Apple",
      selectedMonth: "November",
    };
  }

  // process the upload file
  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const parsedData = result.data
            .filter((item) => item.Date) // date value
            .map((item) => ({
              ...item,
              Date: new Date(item.Date).toISOString().split("T")[0], 
              Open: parseFloat(item.Open),
              Close: parseFloat(item.Close),
              difference: parseFloat(item.Open) - parseFloat(item.Close), 
            }));
          this.setState({ data: parsedData });
        },
      });
    }
  };

  // base on company filter the months
  filterData = () => {
    const { data, company, selectedMonth } = this.state;
    const filtered = data.filter((item) => {
      const date = new Date(item.Date);
      const monthName = date.toLocaleString("default", { month: "long" });
      return item.Company === company && monthName === selectedMonth;
    });
    this.setState({ filteredData: filtered });
  };

  // Re-filter the data when the status changes
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.data !== this.state.data ||
      prevState.company !== this.state.company ||
      prevState.selectedMonth !== this.state.selectedMonth
    ) {
      this.filterData();
    }
  }

  // Processing company selection
  handleCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  // Processing month selection
  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
  };

  render() {
    const { filteredData, company, selectedMonth } = this.state;

    return (
      <div className="child-container">
        <h2>Upload a CSV File</h2>
        <input type="file" accept=".csv" onChange={this.handleFileUpload} />

        <div className="controls">
          <div>
            <label>Company: </label>
            <input
              type="radio"
              value="Apple"
              checked={company === "Apple"}
              onChange={this.handleCompanyChange}
            />
            Apple
            <input
              type="radio"
              value="Microsoft"
              checked={company === "Microsoft"}
              onChange={this.handleCompanyChange}
            />
            Microsoft
            <input
              type="radio"
              value="Amazon"
              checked={company === "Amazon"}
              onChange={this.handleCompanyChange}
            />
            Amazon
            <input
              type="radio"
              value="Google"
              checked={company === "Google"}
              onChange={this.handleCompanyChange}
            />
            Google
            <input
              type="radio"
              value="Meta"
              checked={company === "Meta"}
              onChange={this.handleCompanyChange}
            />
            Meta
          </div>

          <div>
            <label>Month: </label>
            <select value={selectedMonth} onChange={this.handleMonthChange}>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <LineChart width={600} height={400} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              }
              tickMargin={10}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="top"
              iconType="square"
              wrapperStyle={{ paddingLeft: 10 , lineHeight: "30px"}}
              
            />
            <Line
              type="monotone"
              dataKey="Open"
              stroke="#b2df8a"
              strokeWidth={3}
              activeDot={{ r: 8, fill:"#b2df8a", stroke: "none" }}
              dot={{ r: 4, fill: "#b2df8a", stroke: "none" }}
            />
            <Line
              type="monotone"
              dataKey="Close"
              stroke="#e41a1c"
              strokeWidth={3}
              activeDot={{ r: 6, fill: "#e41a1c", stroke: "none" }} 
              dot={{ r: 4, fill: "#e41a1c", stroke: "none" }} 
            />
          </LineChart>
        </div>
      </div>
    );
  }
}

export default Child1;

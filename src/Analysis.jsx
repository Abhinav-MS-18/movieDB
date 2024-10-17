import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Analysis = () => {
  const [data, setData] = useState({
    genreRevenue: [],
    averageGenreRevenue: [],
    topActors: [],
    roiData: [],
    moviesPerYear: [],
    revenuePerYear: [],
  });
  const [activeTab, setActiveTab] = useState("charts");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/analysis");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Movie Analysis Dashboard
      </h1>

      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 ${
            activeTab === "charts" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("charts")}
        >
          Charts
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "tables" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("tables")}
        >
          Tables
        </button>
      </div>

      {activeTab === "charts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Total Revenue by Genre
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.genreRevenue}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Average Revenue by Genre
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.averageGenreRevenue}
                  dataKey="averageRevenue"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data.averageGenreRevenue.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Movies Released per Year
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.moviesPerYear}>
                <XAxis dataKey="_id.year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Total Revenue by Year
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenuePerYear}>
                <XAxis dataKey="_id.year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "tables" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Top 10 Actors by Total Revenue
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Actor</th>
                  <th className="text-left">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topActors.map((actor, index) => (
                  <tr key={index}>
                    <td>{actor._id}</td>
                    <td>${(actor.totalRevenue / 1e9).toFixed(2)}B</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              Return on Investment (ROI)
            </h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Movie</th>
                  <th className="text-left">ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.roiData.map((movie, index) => (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td>{movie.roi.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;

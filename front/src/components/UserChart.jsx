import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen yang diperlukan untuk Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserChart = () => {
  // Data pengguna
  const userData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Active Users",
        data: [120, 150, 170, 200, 220, 250],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "New Users",
        data: [50, 80, 90, 120, 130, 160],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opsi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Statistics",
      },
    },
  };

  return <Bar data={userData} options={options} />;
};

export default UserChart;

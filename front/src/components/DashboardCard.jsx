import React from "react";

const DashboardCard = ({ title, value, description, color, icon, textColor }) => {
    return (
        <div className={`p-4 ${color} rounded-md`}>
        <div className="flex justify-between items-center">
            <div>
            <h3 className={`font-semibold ${textColor}`}>{title}</h3>
            <p className={`text-2xl font-bold mt-2 ${ textColor }`}>{value}</p>
            <p className={`text-sm ${textColor} mt-3`}>{description}</p>
            </div>
            <div className={`${textColor} text-4xl`}>{icon}</div>
        </div>
        </div>
    )
}

export default DashboardCard
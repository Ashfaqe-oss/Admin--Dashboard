import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id); //actual find operation here
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const getDashboardStats = async(req, res) => {
    try {
        //hardcode date values
        const currentMonth = "December";
        const currentYear = 2021;
        const currentDay = "2021-12-15";

        //recent transactions
        const transactions = await Transaction.find()
            .limit(50)
            .sort({ createdAt: -1 });

        //overall stats
        const overallStat = await OverallStat.find({ year: currentYear });

        //destructuring overall stat
        const {
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
        } = overallStat[0];

        const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
            return month === currentMonth;
        });

        const todayStats = overallStat[0].dailyData.find(({ date }) => {
            return date === currentDay;
        });

        res.status(200).json({
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            thisMonthStats,
            todayStats,
            salesByCategory,
            transactions
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};
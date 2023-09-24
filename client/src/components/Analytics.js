import React from "react";
import { Progress } from "antd";
import moment from "moment";
const Analytics = ({ allTransection }) => {
  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];
  const totalExpenseTransactions = allTransection.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalTurnover = allTransection.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransection
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransection
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100;

    const calculateMonthlyExpenses = () => {
      const monthlyExpenses = {};
      allTransection
        .filter((transaction) => transaction.type === "expense")
        .forEach((transaction) => {
          const monthYear = moment(transaction.date).format("MMM YYYY");
          if (!monthlyExpenses[monthYear]) {
            monthlyExpenses[monthYear] = 0;
          }
          monthlyExpenses[monthYear] += transaction.amount;
        });
  
      return monthlyExpenses;
    };

    const monthlyExpenses = calculateMonthlyExpenses();

    const monthlyExpenseTrend = (
      <div className="col-md-6">
        <h6 className="bg-info p-2 text-light">Monthly Spending Trend</h6>
        <div>
          {Object.entries(monthlyExpenses).map(([monthYear, amount]) => (
            <div className="card mt-2" key={monthYear}>
              <div className="card-body">
                <h6>{monthYear}</h6>
                <Progress type="line"
                  percent={((amount / totalExpenseTurnover) * 100).toFixed(0)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );



  return (
    <>
      <div className="row m-3">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">Total TurnOver : {totalTurnover}</div>
            <div className="card-body">
              <h5 className="text-success">Income : {totalIncomeTurnover}</h5>
              <h5 className="text-danger">Expense : {totalExpenseTurnover}</h5>
              <div>
                <Progress
                  type="circle"
                  strokeColor={"green"}
                  className="mx-2"
                  percent={totalIncomeTurnoverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={"red"}
                  className="mx-2 mt-3"
                  percent={totalExpenseTurnoverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <h6 className="bg-warning p-2 text-light">Categorywise Expense</h6>
          {categories.map((category) => {
            const amount = allTransection
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card mt-2">
                  <div className="card-body">
                    <h6>{category}</h6>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        {monthlyExpenseTrend}
      </div>
      <div className="row mt-3 analytics"></div>
    </>
  );
};

export default Analytics;
import food from "../assets/images/food.png";
import health from "../assets/images/health.png";
import entertainment from "../assets/images/entertainment.png";
import rental from "../assets/images/Rental.png";
import clothing from "../assets/images/Clothing.png";
import gas from "../assets/images/gas.png";
import debt from "../assets/images/debt.png";
import education from "../assets/images/education.png";
import repair from "../assets/images/repair.png";
import houseExpense from "../assets/images/houseExpense.png";
import socialLife from "../assets/images/socialLife.png";
import income from "../assets/images/income.png";
import culture from "../assets/images/culture.png";
import utilities from "../assets/images/utilities.png";
import transport from "../assets/images/transport.png";
import gift from "../assets/images/gift.png";

export const category = {
  Clothing: clothing,
  Transport: transport,
  Food: food,
  Gift: gift,
  "Social Life": socialLife,
  Education: education,
  Health: health,
  "Housing Expenses": houseExpense,
  Rental: rental,
  Culture: culture,
  Debt: debt,
  Entertainment: entertainment,
  Gas: gas,
  Income: income,
  Repairs: repair,
  Utilities: utilities,
};

export const categoryFunc = (categoryName) => {
  switch (categoryName) {
    case "Clothing":
      return clothing;
    case "Travel":
      return transport;
    case "Transport":
      return transport;
    case "Food":
      return food;
    case "Gift":
      return gift;
    case "Social Life":
      return socialLife;
    case "Education":
      return education;
    case "Health":
      return health;
    case "Housing Expenses":
      return houseExpense;
    case "Rental":
      return rental;
    case "Culture":
      return culture;
    case "Debt":
      return debt;
    case "Entertainment":
      return entertainment;
    case "Gas":
      return gas;
    case "Income":
      return income;
    case "Repairs":
      return repair;
    case "Utilities":
      return utilities;
  }
};

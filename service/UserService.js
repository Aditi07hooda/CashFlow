import bcrypt from "bcrypt";
import UserRepo from "../repository/UserRepo.js";
import TransactionService from "./TransactionService.js";

const UserService = {
  registerUser: async (user) => {
    const existingUser = await UserRepo.findByEmail(user.email);
    if (existingUser)
      throw new Error(
        "Email already in use. Please register with a new email address"
      );

    user.password = await bcrypt.hash(user.password, 12);
    return await UserRepo.create(user);
  },

  login: async (email, password) => {
    const user = await UserRepo.findByEmail(email);
    if (!user) throw new Error("User not found. Please login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return user;
  },

  getUser: async (username, dateMin, dateMax) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const totalIncome = await TransactionService.getTotalIncome(
      username,
      dateMin,
      dateMax
    );
    const totalExpense = await TransactionService.getTotalSpent(
      username,
      dateMin,
      dateMax
    );
    const transactions = await TransactionService.getAllTransactions(username);

    return { user, totalIncome, totalExpense, transactions };
  },
};

export default UserService;

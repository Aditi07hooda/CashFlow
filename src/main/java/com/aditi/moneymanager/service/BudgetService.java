package com.aditi.moneymanager.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aditi.moneymanager.model.BudgetModel;
import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.BudgetRepo;
import com.aditi.moneymanager.repo.CategoryRepo;
import com.aditi.moneymanager.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepo repo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Transactional
    public BudgetModel createBudget(Map<String, Object> payload) {
        // Validate amount
        Double amount = ((Number) payload.get("amount")).doubleValue();
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Transaction amount must be greater than 0");
        }

        // Fetch user
        String username = (String) payload.get("username");
        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        // Parse and validate start date
        String startDate = payload.get("startDate").toString();
        if (startDate.isEmpty()) {
            throw new IllegalArgumentException("start date is required");
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        java.sql.Date startingBudgetDate;
        try {
            Date utilDate = dateFormat.parse(startDate);
            startingBudgetDate = new java.sql.Date(utilDate.getTime());
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid transaction date format. Expected format: dd/MM/yyyy");
        }

        // Parse and validate end date
        String endDate = payload.get("endDate").toString();
        if (endDate.isEmpty()) {
            throw new IllegalArgumentException("start date is required");
        }
        dateFormat.setLenient(false);
        java.sql.Date endingBudgetDate;
        try {
            Date utilDate = dateFormat.parse(endDate);
            endingBudgetDate = new java.sql.Date(utilDate.getTime());
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid transaction date format. Expected format: dd/MM/yyyy");
        }

        // Parse and validate budget period
        String budgetPeriod = payload.get("budgetPeriod").toString().toUpperCase();
        if (budgetPeriod == null || budgetPeriod.isEmpty()) {
            throw new IllegalArgumentException("Transaction type is required");
        }
        BudgetModel.BudgetPeriod period;
        try {
            period = BudgetModel.BudgetPeriod.valueOf(budgetPeriod);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Account type is not supported");
        }

        // Fetch and validate categories
        List<String> categoryNames = (List<String>) payload.get("categoryNames");
        if (categoryNames == null || categoryNames.isEmpty()) {
            throw new IllegalArgumentException("At least one category must be selected");
        }

        List<CategoryModel> categories;

        if (categoryNames.contains("ALL")) {
            categories = categoryRepo.findAll();
            if (categories.isEmpty()) {
                throw new IllegalArgumentException("No categories available in the database");
            }
        } else {
            categories = categoryNames.stream()
                    .map(name -> {
                        return categoryRepo.findByCategoryName(name);
                    })
                    .filter(category -> category != null)
                    .collect(Collectors.toList());

            if (categories.isEmpty()) {
                throw new IllegalArgumentException("None of the specified categories were found");
            }
        }

        BudgetModel budget = new BudgetModel();
        budget.setBudget(amount);
        budget.setStartDate(startingBudgetDate);
        budget.setEndDate(endingBudgetDate);
        budget.setPeriod(period);
        budget.setUser(user);
        budget.setCategories(categories);
        budget.setDescription(payload.get("description").toString());
        budget.setCreatedAt(new java.sql.Date(System.currentTimeMillis()));
        budget.setUpdatedAt(new java.sql.Date(System.currentTimeMillis()));

        return repo.save(budget);
    }

    public List<BudgetModel> getAllBudgets(String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        return repo.findByUser(user);
    }

    @Transactional
    public void deleteBudget(Long budgetId, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        if (!repo.existsById(budgetId)) {
            throw new IllegalArgumentException("Budget not found with ID: " + budgetId);
        }

        repo.deleteById(budgetId);
    }
}

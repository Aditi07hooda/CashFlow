package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aditi.moneymanager.model.BudgetModel;
import com.aditi.moneymanager.service.BudgetService;

@RestController
public class BudgetController {

    @Autowired
    private BudgetService service;

    @PostMapping("/budget")
    public ResponseEntity<BudgetModel> createBudget(Authentication req, @RequestBody Map<String, Object> payload) {
        BudgetModel budget = service.createBudget(req.getName(), payload);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/budget")
    public ResponseEntity<List<BudgetModel>> getAllTransactions(Authentication req) {
        List<BudgetModel> budget = service.getAllBudgets(req.getName());
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/budget/{id}")
    public ResponseEntity<Void> deleteBudget(Authentication req, @PathVariable Long id) {
        service.deleteBudget(id, req.getName());
        return ResponseEntity.noContent().build();
    }
}

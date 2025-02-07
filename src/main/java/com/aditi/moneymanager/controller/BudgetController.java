package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<BudgetModel> createBudget(@RequestBody Map<String, Object> payload) {
        BudgetModel budget = service.createBudget(payload);
        return ResponseEntity.ok(budget);
    }

    @GetMapping("/budget")
    public ResponseEntity<List<BudgetModel>> getAllTransactions(@RequestParam String username) {
        List<BudgetModel> budget = service.getAllBudgets(username);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/budget/{id}")
    public ResponseEntity<Void> deleteBudget(@RequestParam String username, @PathVariable Long id) {
        service.deleteBudget(id, username);
        return ResponseEntity.noContent().build();
    }
}

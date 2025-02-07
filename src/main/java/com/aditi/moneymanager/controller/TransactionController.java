package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aditi.moneymanager.model.TransactionModel;
import com.aditi.moneymanager.service.TransactionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.ByteArrayInputStream;

@RestController
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping("/transaction")
    public ResponseEntity<TransactionModel> createTransaction(@RequestBody Map<String, Object> payload) {
        TransactionModel transaction = service.createTransaction(payload);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/transaction/{id}")
    public ResponseEntity<TransactionModel> updateTransaction(@RequestBody Map<String, Object> payload,
            @RequestParam String username, @PathVariable Long id) {
        TransactionModel transaction = service.updateTransaction(id, username, payload);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/transaction/{id}")
    public ResponseEntity<Void> deleteBudget(@RequestParam String username, @PathVariable Long id) {
        service.deleteTransaction(id, username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionModel>> getAllTransactions(@RequestParam String username) {
        List<TransactionModel> transaction = service.getAllTransactions(username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/category")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByCategory(@RequestParam String username,
            @RequestBody Map<String, Object> category) {
        List<TransactionModel> transaction = service.getAllTransactionsByCategory(category, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/transactionType")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByTransactionType(@RequestParam String username,
            @RequestBody Map<String, Object> type) {
        List<TransactionModel> transaction = service.getAllTransactionsByType(type, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/above")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountAbove(@RequestParam String username,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountAbove(amt, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/below")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountBelow(@RequestParam String username,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountBelow(amt, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/between")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountBetween(@RequestParam String username,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountBetween(amt, username);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/dates/between")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByDate(@RequestParam String username,
            @RequestParam String dateMin, @RequestParam String dateMax) {
        List<TransactionModel> transaction = service.getAllTransactionBetweenDate(username, dateMin, dateMax);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/income/total")
    public ResponseEntity<Double> GetTotalIncome(@RequestParam String username, @RequestParam String minDateControl,
            @RequestParam String maxDateControl) {
        Double income = service.getTotalIncome(username, minDateControl, maxDateControl);
        return ResponseEntity.ok(income);
    }

    @GetMapping("/spent/total")
    public ResponseEntity<Double> GetTotalSpent(@RequestParam String username, @RequestParam String minDateControl,
            @RequestParam String maxDateControl) {
        Double income = service.getTotalSpending(username, minDateControl, maxDateControl);
        return ResponseEntity.ok(income);
    }

    @GetMapping("/category/all/spending")
    public ResponseEntity<Map<String, Object>> getAllCategorySpending(@RequestParam String username) {
        Map<String, Object> category = service.getTransactionByAllCategoryExpense(username);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/category/all/income")
    public ResponseEntity<Map<String, Object>> getAllCategoryIncome(@RequestParam String username) {
        Map<String, Object> category = service.getTransactionbyAllCategoryIncome(username);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/transactions/downloadPDFFile")
    public ResponseEntity<byte[]> downloadTransactionsPDF(@RequestParam String username) {
        ByteArrayInputStream pdfData = service.generateTransactionsPDFForCurrentYear(username);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData.readAllBytes());
    }
}

package com.aditi.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<TransactionModel> createTransaction(Authentication req, @RequestBody Map<String, Object> payload) {
        payload.put("username", req.getName());
        TransactionModel transaction = service.createTransaction(payload);
        return ResponseEntity.ok(transaction);
    }

    @PutMapping("/transaction/{id}")
    public ResponseEntity<TransactionModel> updateTransaction(@RequestBody Map<String, Object> payload,
                                                              Authentication req, @PathVariable Long id) {
        TransactionModel transaction = service.updateTransaction(id, req.getName(), payload);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/transaction/{id}")
    public ResponseEntity<Void> deleteBudget(Authentication req, @PathVariable Long id) {
        service.deleteTransaction(id, req.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionModel>> getAllTransactions(Authentication req) {
        List<TransactionModel> transaction = service.getAllTransactions(req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/category")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByCategory(Authentication req,
            @RequestBody Map<String, Object> category) {
        List<TransactionModel> transaction = service.getAllTransactionsByCategory(category, req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/transactionType")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByTransactionType(Authentication req,
            @RequestBody Map<String, Object> type) {
        List<TransactionModel> transaction = service.getAllTransactionsByType(type, req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/above")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountAbove(Authentication req,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountAbove(amt, req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/below")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountBelow(Authentication req,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountBelow(amt, req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/amount/between")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByAmountBetween(Authentication req,
            @RequestBody Map<String, Object> amt) {
        List<TransactionModel> transaction = service.getAllTransactionsByAmountBetween(amt, req.getName());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/transactions/dates/between")
    public ResponseEntity<List<TransactionModel>> getAllTransactionsByDate(Authentication req,
            @RequestParam String dateMin, @RequestParam String dateMax) {
        List<TransactionModel> transaction = service.getAllTransactionBetweenDate(req.getName(), dateMin, dateMax);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/income/total")
    public ResponseEntity<Double> GetTotalIncome(Authentication req, @RequestParam String minDateControl,
            @RequestParam String maxDateControl) {
        Double income = service.getTotalIncome(req.getName(), minDateControl, maxDateControl);
        return ResponseEntity.ok(income);
    }

    @GetMapping("/spent/total")
    public ResponseEntity<Double> GetTotalSpent(Authentication req, @RequestParam String minDateControl,
            @RequestParam String maxDateControl) {
        Double income = service.getTotalSpending(req.getName(), minDateControl, maxDateControl);
        return ResponseEntity.ok(income);
    }

    @GetMapping("/category/all/spending")
    public ResponseEntity<Map<String, Object>> getAllCategorySpending(Authentication req) {
        Map<String, Object> category = service.getTransactionByAllCategoryExpense(req.getName());
        return ResponseEntity.ok(category);
    }

    @GetMapping("/category/all/income")
    public ResponseEntity<Map<String, Object>> getAllCategoryIncome(Authentication req) {
        Map<String, Object> category = service.getTransactionbyAllCategoryIncome(req.getName());
        return ResponseEntity.ok(category);
    }

    @GetMapping("/transactions/downloadPDFFile")
    public ResponseEntity<byte[]> downloadTransactionsPDF(Authentication req) {
        ByteArrayInputStream pdfData = service.generateTransactionsPDFForCurrentYear(req.getName());

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData.readAllBytes());
    }
}

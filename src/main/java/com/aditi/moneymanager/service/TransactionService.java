package com.aditi.moneymanager.service;

import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.element.Cell;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.model.TransactionModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.CategoryRepo;
import com.aditi.moneymanager.repo.TransactionRepo;
import com.aditi.moneymanager.repo.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepo repo;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CategoryRepo categoryRepo;

    @Transactional
    public TransactionModel createTransaction(Map<String, Object> payload) {
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

        // Fetch category
        String categoryName = (String) payload.get("category");
        if (categoryName == null || categoryName.isEmpty()) {
            throw new IllegalArgumentException("Category name is required");
        }
        CategoryModel category = categoryRepo.findByCategoryName(categoryName);
        if (category == null) {
            throw new IllegalArgumentException("Category not found: " + categoryName);
        }

        // Parse and validate transaction date
        String transactionDateString = payload.get("transactionDate").toString();
        if (transactionDateString.isEmpty()) {
            throw new IllegalArgumentException("Transaction date is required");
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        java.sql.Date transactionDate;
        try {
            Date utilDate = dateFormat.parse(transactionDateString);
            transactionDate = new java.sql.Date(utilDate.getTime());
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid transaction date format. Expected format: dd/MM/yyyy");
        }
        System.out.println("Transaction date : " + transactionDate + " " + transactionDateString);

        // Parse and validate transaction type
        String transactionType = payload.get("transactionType").toString().toUpperCase();
        if (transactionType == null || transactionType.isEmpty()) {
            throw new IllegalArgumentException("Transaction type is required");
        }
        TransactionModel.TransactionType type;
        try {
            type = TransactionModel.TransactionType.valueOf(transactionType);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException("Transaction type is not supported");
        }

        // parse and validate account type
        String accountType = payload.get("accountType").toString().toUpperCase();
        if (accountType == null || accountType.isEmpty()) {
            throw new IllegalArgumentException("Account type is required");
        }
        TransactionModel.AccountType accountingType;
        try {
            accountingType = TransactionModel.AccountType.valueOf(accountType);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Account type is not supported");
        }

        // Create transaction model
        TransactionModel transaction = new TransactionModel();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setNote(payload.get("note") != null ? payload.get("note").toString() : null);
        transaction.setAmount(amount);
        transaction.setTransactionDate(transactionDate);
        transaction.setTransactionType(type);
        transaction.setAccountType(accountingType);
        transaction.setCreatedAt(new java.sql.Date(System.currentTimeMillis()));
        transaction.setUpdatedAt(new java.sql.Date(System.currentTimeMillis()));

        // Save transaction
        return repo.save(transaction);
    }

    public List<TransactionModel> getAllTransactions(String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        return repo.findByUser(user);
    }

    public List<TransactionModel> getAllTransactionsByCategory(Map<String, Object> categoryName, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        CategoryModel category = categoryRepo.findByCategoryName(categoryName.get("category").toString());
        if (category == null) {
            throw new IllegalArgumentException("category not found: " + categoryName);
        }
        return repo.findByUserAndCategory(user, category);
    }

    public List<TransactionModel> getAllTransactionsByType(Map<String, Object> type, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        TransactionModel.TransactionType transactionType = TransactionModel.TransactionType
                .valueOf(type.get("type").toString().toUpperCase());
        return repo.findByUserAndTransactionType(user, transactionType);
    }

    public List<TransactionModel> getAllTransactionsByAmountAbove(Map<String, Object> amt, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        Double amount = ((Number) amt.get("amount")).doubleValue();
        if (amount < 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
        return repo.findByUserAndAmountGreaterThan(user, amount);
    }

    public List<TransactionModel> getAllTransactionsByAmountBelow(Map<String, Object> amt, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        Double amount = ((Number) amt.get("amount")).doubleValue();
        if (amount < 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
        return repo.findByUserAndAmountLessThan(user, amount);
    }

    public List<TransactionModel> getAllTransactionsByAmountBetween(Map<String, Object> amt, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        Double amountMin = ((Number) amt.get("amountMin")).doubleValue();
        if (amountMin < 0) {
            throw new IllegalArgumentException("Invalid amount");
        }
        Double amountMax = ((Number) amt.get("amountMax")).doubleValue();
        if (amountMax < 0 || amountMax < amountMin) {
            throw new IllegalArgumentException("Invalid max amount");
        }
        return repo.findTransactionByAmountBetween(amountMin, amountMax, user);
    }

    public List<TransactionModel> getAllTransactionBetweenDate(String username, String dateMinControl,
            String dateMaxControl) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        LocalDate dateMin;
        LocalDate dateMax;
        try {
            dateMin = LocalDate.parse(dateMinControl.toString(), dateFormat);
            dateMax = LocalDate.parse(dateMaxControl.toString(), dateFormat);
            System.out.println(dateMin.toString() + " " + dateMax.toString());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid transaction date format. Expected format: dd/MM/yyyy");
        }

        if (dateMin.isAfter(dateMax)) {
            throw new IllegalArgumentException("Invalid date range: dateMin (" + dateMin
                    + ") must be before or equal to dateMax (" + dateMax + ")");
        }

        if (dateMin == null || dateMax == null) {
            throw new IllegalArgumentException("Invalid date");
        }

        return repo.findByTransactionDateBetweenAndUser(dateMin, dateMax, user.getId());
    }

    public double getTotalIncome(String username, String dateMinControl, String dateMaxControl) {
        List<TransactionModel> transactions = getAllTransactionBetweenDate(username, dateMinControl, dateMaxControl);
        double total = 0;
        for (TransactionModel transactionModel : transactions) {
            if (transactionModel.getTransactionType().equals(TransactionModel.TransactionType.INCOME)) {
                total += transactionModel.getAmount();
            }
        }
        System.out.println("Total income amount between " + dateMinControl + " and " + dateMaxControl + " - " + total);
        return total;
    }

    public double getTotalSpending(String username, String dateMinControl, String dateMaxControl) {
        List<TransactionModel> transactions = getAllTransactionBetweenDate(username, dateMinControl, dateMaxControl);
        double total = 0;
        for (TransactionModel transactionModel : transactions) {
            if (transactionModel.getTransactionType().equals(TransactionModel.TransactionType.EXPENSE)) {
                total += transactionModel.getAmount();
            }
        }
        System.out
                .println("Total spending amount between " + dateMinControl + " and " + dateMaxControl + " - " + total);
        return total;
    }

    public Map<String, Object> getTransactionByAllCategoryExpense(String username) {
        List<CategoryModel> categories = categoryService.getCategories();
        UserModel user = userRepo.findByUsername(username);

        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        List<Map<String, Object>> categoryResults = new ArrayList<>();

        for (CategoryModel category : categories) {

            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("category", category.getCategoryName());
            List<TransactionModel> transactions = getAllTransactionsByCategory(categoryMap, username);

            // Calculate count and total for expenses
            double total = transactions.stream()
                    .filter(transaction -> transaction.getTransactionType() == TransactionModel.TransactionType.EXPENSE)
                    .mapToDouble(TransactionModel::getAmount)
                    .sum();

            int count = (int) transactions.stream()
                    .filter(transaction -> transaction.getTransactionType() == TransactionModel.TransactionType.EXPENSE)
                    .count();

            // Create a category result
            Map<String, Object> cat = new HashMap<>();
            cat.put("categoryName", category.getCategoryName());
            cat.put("size", count);
            cat.put("total", total);

            categoryResults.add(cat);
        }

        // Sort the category results by the total amount in descending order
        categoryResults.sort((a, b) -> Double.compare((double) b.get("total"), (double) a.get("total")));

        // Convert the sorted list to a map
        Map<String, Object> result = new LinkedHashMap<>();
        for (Map<String, Object> cat : categoryResults) {
            result.put((String) cat.get("categoryName"), cat);
        }

        return result;
    }

    public Map<String, Object> getTransactionbyAllCategoryIncome(String username) {
        List<CategoryModel> categories = categoryService.getCategories();
        UserModel user = userRepo.findByUsername(username);

        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        List<Map<String, Object>> categoryResults = new ArrayList<>();

        for (CategoryModel category : categories) {

            Map<String, Object> categoryMap = new HashMap<>();
            categoryMap.put("category", category.getCategoryName());
            List<TransactionModel> transactions = getAllTransactionsByCategory(categoryMap, username);

            // Calculate count and total for expenses
            double total = transactions.stream()
                    .filter(transaction -> transaction.getTransactionType() == TransactionModel.TransactionType.INCOME)
                    .mapToDouble(TransactionModel::getAmount)
                    .sum();

            int count = (int) transactions.stream()
                    .filter(transaction -> transaction.getTransactionType() == TransactionModel.TransactionType.INCOME)
                    .count();

            // Create a category result
            Map<String, Object> cat = new HashMap<>();
            cat.put("categoryName", category.getCategoryName());
            cat.put("size", count);
            cat.put("total", total);

            categoryResults.add(cat);
        }

        // Sort the category results by the total amount in descending order
        categoryResults.sort((a, b) -> Double.compare((double) b.get("total"), (double) a.get("total")));

        // Convert the sorted list to a map
        Map<String, Object> result = new LinkedHashMap<>();
        for (Map<String, Object> cat : categoryResults) {
            result.put((String) cat.get("categoryName"), cat);
        }

        return result;
    }

    @Transactional
    public void deleteTransaction(Long transId, String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        if (!repo.existsById(transId)) {
            throw new IllegalArgumentException("Transaction not found with ID: " + transId);
        }

        repo.deleteById(transId);
    }

    @Transactional
    public TransactionModel updateTransaction(Long transId, String username, Map<String, Object> payload) {

        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        TransactionModel transaction = repo.findById(transId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with ID: " + transId));

        if (!transaction.getUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Transaction does not belong to the user: " + username);
        }

        if (payload.containsKey("amount")) {
            Double amount = ((Number) payload.get("amount")).doubleValue();
            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Transaction amount must be greater than 0");
            }
            transaction.setAmount(amount);
        }

        if (payload.containsKey("category")) {
            String categoryName = (String) payload.get("category");
            if (categoryName == null || categoryName.isEmpty()) {
                throw new IllegalArgumentException("Category name is required");
            }
            CategoryModel category = categoryRepo.findByCategoryName(categoryName);
            if (category == null) {
                throw new IllegalArgumentException("Category not found: " + categoryName);
            }
            transaction.setCategory(category);
        }

        if (payload.containsKey("transactionDate")) {
            String transactionDateString = payload.get("transactionDate").toString();
            if (transactionDateString.isEmpty()) {
                throw new IllegalArgumentException("Transaction date is required");
            }

            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            dateFormat.setLenient(false);
            try {
                Date utilDate = dateFormat.parse(transactionDateString);
                java.sql.Date transactionDate = new java.sql.Date(utilDate.getTime());
                transaction.setTransactionDate(transactionDate);
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid transaction date format. Expected format: dd/MM/yyyy");
            }
        }

        if (payload.containsKey("transactionType")) {
            String transactionType = payload.get("transactionType").toString().toUpperCase();
            if (transactionType == null || transactionType.isEmpty()) {
                throw new IllegalArgumentException("Transaction type is required");
            }
            try {
                TransactionModel.TransactionType type = TransactionModel.TransactionType.valueOf(transactionType);
                transaction.setTransactionType(type);
            } catch (IllegalArgumentException | NullPointerException e) {
                throw new IllegalArgumentException("Transaction type is not supported");
            }
        }

        if (payload.containsKey("accountType")) {
            String accountType = payload.get("accountType").toString().toUpperCase();
            if (accountType == null || accountType.isEmpty()) {
                throw new IllegalArgumentException("Account type is required");
            }
            try {
                TransactionModel.AccountType accountingType = TransactionModel.AccountType.valueOf(accountType);
                transaction.setAccountType(accountingType);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Account type is not supported");
            }
        }

        if (payload.containsKey("note")) {
            transaction.setNote(payload.get("note") != null ? payload.get("note").toString() : null);
        }

        transaction.setUpdatedAt(new java.sql.Date(System.currentTimeMillis()));

        return repo.save(transaction);
    }

    public ByteArrayInputStream generateTransactionsPDFForCurrentYear(String username) {
        UserModel user = userRepo.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }

        LocalDate now = LocalDate.now();
        String startOfYear = now.withDayOfYear(1).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String endOfYear = now.withDayOfYear(now.lengthOfYear()).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        List<TransactionModel> transactions = getAllTransactionBetweenDate(username, startOfYear, endOfYear);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Add Title
            Paragraph title = new Paragraph("Transactions for the Year")
                    .setFontSize(18)
                    .setBold()
                    .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
            document.add(title);

            // Create Table with 7 Columns
            float[] columnWidths = { 1, 2, 2, 2, 1, 2, 3 };
            Table table = new Table(columnWidths).setWidth(UnitValue.createPercentValue(100)); // Corrected here

            // Add Header Row
            String[] headers = { "ID", "Date", "Amount", "Category", "Type", "Account Type", "Note" };
            for (String header : headers) {
                Cell headerCell = new Cell()
                        .add(new Paragraph(header)) // Wrap header in Paragraph
                        .setBold()
                        .setHorizontalAlignment(com.itextpdf.layout.properties.HorizontalAlignment.CENTER);
                table.addHeaderCell(headerCell);
            }

            // Add Transaction Rows
            for (TransactionModel transaction : transactions) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(transaction.getId())))); // Wrap in Paragraph
                table.addCell(new Cell().add(new Paragraph(transaction.getTransactionDate().toString()))); // Wrap in
                                                                                                           // Paragraph
                table.addCell(new Cell().add(new Paragraph(String.valueOf(transaction.getAmount())))); // Wrap in
                                                                                                       // Paragraph
                table.addCell(new Cell().add(new Paragraph(transaction.getCategory().getCategoryName()))); // Wrap in
                                                                                                           // Paragraph
                table.addCell(new Cell().add(new Paragraph(transaction.getTransactionType().name()))); // Wrap in
                                                                                                       // Paragraph
                table.addCell(new Cell().add(new Paragraph(transaction.getAccountType().name()))); // Wrap in Paragraph
                table.addCell(
                        new Cell().add(new Paragraph(transaction.getNote() != null ? transaction.getNote() : ""))); // Wrap
                                                                                                                    // in
                                                                                                                    // Paragraph
            }

            document.add(table);
            document.close();

            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Error while generating PDF file", e);
        }
    }
}
package com.aditi.moneymanager.controller;

import org.springframework.web.bind.annotation.RestController;

import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.UserRepo;
import com.aditi.moneymanager.service.CategoryService;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService service;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/admin/category")
    public ResponseEntity<CategoryModel> postMethodName(@RequestBody CategoryModel category,
            HttpServletResponse response) {
        CategoryModel cat = service.saveCategory(category);
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/admin/category")
    public ResponseEntity<List<CategoryModel>> getAllCategories() {
        List<CategoryModel> cat = service.getCategories();
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/category")
    public ResponseEntity<List<CategoryModel>> getAllCategoriesForUsers(@RequestParam String username) {
         UserModel user = userRepo.findByUsername(username);

        if (user == null) {
            throw new IllegalArgumentException("User not found: " + username);
        }
        List<CategoryModel> cat = service.getCategories();
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/admin/category/{categoryName}")
    public ResponseEntity<CategoryModel> getSingleCategory(@PathVariable String categoryName) {
        try {
            CategoryModel cat = service.getCategory(categoryName);
            return ResponseEntity.ok(cat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CategoryModel());
        }
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<CategoryModel> getSingleCategoryForUsers(@PathVariable String categoryName) {
        try {
            CategoryModel cat = service.getCategory(categoryName);
            return ResponseEntity.ok(cat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new CategoryModel());
        }
    }
}

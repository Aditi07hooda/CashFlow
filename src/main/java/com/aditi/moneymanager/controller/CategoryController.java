package com.aditi.moneymanager.controller;

import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.model.UserModel;
import com.aditi.moneymanager.repo.UserRepo;
import com.aditi.moneymanager.service.CategoryService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@RestController
public class CategoryController {

    @Autowired
    private CategoryService service;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/admin/category")
    public ResponseEntity<CategoryModel> createCategory(@RequestBody CategoryModel category) {
        CategoryModel cat = service.saveCategory(category);
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/admin/category")
    public ResponseEntity<List<CategoryModel>> getAllCategories() {
        List<CategoryModel> cat = service.getCategories();
        return ResponseEntity.ok(cat);
    }

    @GetMapping("/category")
    public ResponseEntity<List<CategoryModel>> getAllCategoriesForUsers(Authentication req) {
         UserModel user = userRepo.findByUsername(req.getName());

        if (user == null) {
            throw new IllegalArgumentException("User not found: " + req.getName());
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

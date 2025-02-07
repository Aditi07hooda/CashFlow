package com.aditi.moneymanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.repo.CategoryRepo;

@Service
public class CategoryService {
    
    @Autowired 
    private CategoryRepo repo;

    public CategoryModel saveCategory(CategoryModel category){
        return repo.save(category);
    }

    public List<CategoryModel> getCategories(){
        return repo.findAll();
    }

    public CategoryModel getCategory(String categoryName) {
        return repo.findByCategoryName(categoryName);
    }
}

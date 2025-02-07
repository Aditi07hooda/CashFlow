package com.aditi.moneymanager.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aditi.moneymanager.model.CategoryModel;


@Repository
public interface CategoryRepo extends JpaRepository<CategoryModel, Long>{
    
    CategoryModel findByCategoryName(String categoryName);
}

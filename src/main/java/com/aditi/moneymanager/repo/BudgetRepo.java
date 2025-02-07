package com.aditi.moneymanager.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aditi.moneymanager.model.BudgetModel;
import com.aditi.moneymanager.model.UserModel;

@Repository
public interface BudgetRepo extends JpaRepository<BudgetModel, Long> {
    List<BudgetModel> findByUser(UserModel user);
}

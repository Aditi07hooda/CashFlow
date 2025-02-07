package com.aditi.moneymanager.repo;

import java.util.List;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aditi.moneymanager.model.CategoryModel;
import com.aditi.moneymanager.model.TransactionModel;
import com.aditi.moneymanager.model.UserModel;

@Repository
public interface TransactionRepo extends JpaRepository<TransactionModel, Long> {
    List<TransactionModel> findByUserAndCategory(UserModel user, CategoryModel category);

    List<TransactionModel> findByUser(UserModel user);

    List<TransactionModel> findByUserAndTransactionType(UserModel user,
            TransactionModel.TransactionType transactionType);

    List<TransactionModel> findByUserAndAmountGreaterThan(UserModel user, double amount);

    List<TransactionModel> findByUserAndAmountLessThan(UserModel user, double amount);

    @Query("SELECT t FROM TransactionModel t WHERE t.amount > ?1 AND t.amount < ?2 AND t.user = ?3")
    List<TransactionModel> findTransactionByAmountBetween(double min, double max, UserModel user);

    @Query("SELECT t FROM TransactionModel t WHERE t.transactionDate BETWEEN :startDate AND :endDate AND t.user.id = :userId")
    List<TransactionModel> findByTransactionDateBetweenAndUser(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("userId") Long userId);

}

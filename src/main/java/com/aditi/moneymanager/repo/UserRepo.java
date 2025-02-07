package com.aditi.moneymanager.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aditi.moneymanager.model.UserModel;

@Repository
public interface UserRepo extends JpaRepository<UserModel, Long> {

    UserModel findByUsername(String username);
    UserModel findByEmail(String email);
    
}

package com.aditi.moneymanager.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aditi.moneymanager.model.NotesModel;
import com.aditi.moneymanager.model.UserModel;

@Repository
public interface NotesRepo extends JpaRepository<NotesModel, Long> {
    
    List<NotesModel> findByUser(UserModel user);
}
